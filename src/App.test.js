import { render, screen } from "@testing-library/react";
import App from "./App";

// The footer is static, so the monster fetch is stubbed out and never resolves.
jest.mock("./utils/data.utils", () => ({
  getData: () => new Promise(() => {}),
}));

test("renders the page footer with the product name and copyright", () => {
  render(<App />);
  const footer = screen.getByRole("contentinfo");
  expect(footer).toHaveClass("app-footer");
  expect(footer).toHaveTextContent("Monsters Rolodex © 2026");
});

test("renders an about link in the page footer", () => {
  render(<App />);
  const link = screen.getByRole("link", { name: /about/i });
  expect(link).toHaveAttribute("href", "/about");
  expect(screen.getByRole("contentinfo")).toContainElement(link);
});

test("renders the page footer after the monster card grid", () => {
  const { container } = render(<App />);
  const app = container.querySelector(".App");
  expect(app.lastElementChild).toBe(screen.getByRole("contentinfo"));
});
