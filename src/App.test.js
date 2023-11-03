import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders title", () => {
  render(<App />);
  const linkElement = screen.getByText(/2023 React Fundamentals Workshop/i);
  expect(linkElement).toBeInTheDocument();
});
