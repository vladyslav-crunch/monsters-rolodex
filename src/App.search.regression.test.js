import { StrictMode } from "react";
import { act, render, screen } from "@testing-library/react";
import App from "./App";

const monsters = [
  { id: "1", name: "Leanne Graham", email: "Sincere@april.biz" },
  { id: "2", name: "Ervin Howell", email: "Shanna@melissa.tv" },
];

const staleMonsters = [
  { id: "9", name: "Stale Ghost", email: "stale@nowhere.test" },
];

const originalFetch = global.fetch;

const respondWith = (payload) => {
  global.fetch = () =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(payload) });
};

const respondWithStatus = (status) => {
  global.fetch = () =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({}),
    });
};

const searchField = () => screen.getByPlaceholderText("search monsters");

afterEach(() => {
  global.fetch = originalFetch;
});

test("treats a non-ok response as a failed load", async () => {
  respondWithStatus(503);
  render(<App />);

  expect(
    await screen.findByText("couldn’t reach the monster directory", {
      selector: "p.search-panel-title",
    })
  ).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("couldn’t load the roster");
  expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
});

test("labels the search field programmatically", async () => {
  respondWith(monsters);
  render(<App />);
  await screen.findByText("Leanne Graham");

  expect(screen.getByLabelText("search monsters")).toBe(searchField());
});

test("lets a newer roster response stand and ignores a stale one", async () => {
  const resolvers = [];
  global.fetch = () =>
    new Promise((resolve) => {
      resolvers.push(resolve);
    });

  render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  expect(resolvers).toHaveLength(2);

  await act(async () => {
    resolvers[1]({ ok: true, json: () => Promise.resolve(monsters) });
  });
  expect(screen.getByText("Leanne Graham")).toBeInTheDocument();

  await act(async () => {
    resolvers[0]({ ok: true, json: () => Promise.resolve(staleMonsters) });
  });

  expect(screen.queryByText("Stale Ghost")).not.toBeInTheDocument();
  expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("2 monsters");
});
