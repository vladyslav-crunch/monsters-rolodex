import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

const mockGetData = { current: () => new Promise(() => {}) };

jest.mock("./utils/data.utils", () => ({
  getData: (...args) => mockGetData.current(...args),
}));

const MONSTERS = [
  { id: "1", name: "Leanne Graham", email: "Sincere@april.biz" },
  { id: "2", name: "Ervin Howell", email: "Shanna@melissa.tv" },
];

const search = (value) =>
  fireEvent.change(screen.getByPlaceholderText("search monsters"), {
    target: { value },
  });

const renderWithMonsters = async () => {
  mockGetData.current = () => Promise.resolve(MONSTERS);
  render(<App />);
  await screen.findByText("Leanne Graham");
};

test("shows the lowercased no-match empty state and no cards when nothing matches", async () => {
  await renderWithMonsters();

  search("Z");

  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByText("No monsters match “z”")).toBeInTheDocument();
  expect(screen.getByText("Try a different name.")).toBeInTheDocument();
  expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
});

test("keeps the card grid with no empty state when the query matches", async () => {
  await renderWithMonsters();

  search("leanne");

  expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
  expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("clears the search from the empty state so the full roster shows again", async () => {
  await renderWithMonsters();

  search("Z");
  fireEvent.click(screen.getByRole("button", { name: "Show all monsters" }));

  expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
  expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
  expect(screen.queryByText(/No monsters match/)).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText("search monsters")).toHaveValue("");
});

test("shows the loading state, not the no-match state, while the roster is still loading", () => {
  mockGetData.current = () => new Promise(() => {});

  render(<App />);

  expect(screen.getByText("Summoning monsters…")).toBeInTheDocument();
  expect(screen.queryByText(/No monsters match/)).not.toBeInTheDocument();
});
