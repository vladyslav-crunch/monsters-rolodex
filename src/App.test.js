import { render, screen } from "@testing-library/react";
import App from "./App";

// The footer is static, so the monster fetch is stubbed out and never resolves.
jest.mock("./utils/data.utils", () => ({
  getData: () => new Promise(() => {}),
}));

test("renders the page footer with the product name and copyright", () => {
  render(<App />);
  const footer = screen.getByText("Monsters Rolodex © 2026");
  expect(footer.tagName).toBe("FOOTER");
  expect(footer).toHaveClass("app-footer");
});

test("renders the page footer after the monster card grid", () => {
  const { container } = render(<App />);
  const app = container.querySelector(".App");
  const footer = screen.getByText("Monsters Rolodex © 2026");
  expect(app.lastElementChild).toBe(footer);
});
