import { render, screen } from "@testing-library/react";
import App from "./App";

test("only one burger btn displayed at any given moment", () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  const burgerBtn = screen.getAllByTestId("menu-button");
  expect(burgerBtn).toHaveLength(1);
});
