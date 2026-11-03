import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

const monsters = [
  { id: "1", name: "Leanne Graham", email: "Sincere@april.biz" },
  { id: "2", name: "Ervin Howell", email: "Shanna@melissa.tv" },
];

const originalFetch = global.fetch;

const respondWith = (payload) => {
  global.fetch = () =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(payload) });
};

const failRequest = () => {
  global.fetch = () => Promise.reject(new Error("network is down"));
};

const searchField = () => screen.getByPlaceholderText("search monsters");

afterEach(() => {
  global.fetch = originalFetch;
});

test("shows the loading line, then the roster and its count", async () => {
  respondWith(monsters);
  render(<App />);

  expect(screen.getByRole("status")).toHaveTextContent("loading monsters");

  expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
  expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("2 monsters");
});

test("filters by name as it is typed, ignoring case and surrounding spaces", async () => {
  respondWith(monsters);
  render(<App />);
  await screen.findByText("Leanne Graham");

  fireEvent.change(searchField(), { target: { value: "  LEANNE  " } });

  expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
  expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("1 of 2 monsters match “LEANNE”");

  fireEvent.change(searchField(), { target: { value: "" } });

  expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("2 monsters");
});

test("says when nothing matches, and clears the search back to the full roster", async () => {
  respondWith(monsters);
  render(<App />);
  await screen.findByText("Leanne Graham");

  fireEvent.change(searchField(), { target: { value: "zzz" } });

  expect(screen.getByText("no monsters match “zzz”", { selector: "p.search-panel-title" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("no monsters match “zzz”");
  expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

  expect(searchField()).toHaveValue("");
  expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
  expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("2 monsters");
});

test("says the roster could not load, then recovers when the request is retried", async () => {
  failRequest();
  render(<App />);

  expect(
    await screen.findByText("couldn’t reach the monster directory", { selector: "p.search-panel-title" })
  ).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("couldn’t load the roster");
  expect(screen.queryByText("no monsters match")).not.toBeInTheDocument();

  respondWith(monsters);
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));

  expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("2 monsters");
});
