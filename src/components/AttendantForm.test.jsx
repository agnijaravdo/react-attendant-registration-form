import AttendantForm from "./AttendantForm";
import { render, screen, waitFor } from "@testing-library/react";

it("renders component correctly", async () => {
  const { container } = render(<AttendantForm />);
  await waitFor(
    () => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
  expect(container).toMatchSnapshot();
});

// TODO: add more tests
