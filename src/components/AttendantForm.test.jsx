import AttendantForm from "./AttendantForm";
import { render } from "@testing-library/react";

it("renders component correctly", async () => {
  const props = {
    isAttendantsLoading: false,
    isJobTitlesLoading: false,
    submitAttendant: jest.fn(),
    attendants: [],
    jobTitles: ["Accountant", "Engineer", "Lawyer", "Teacher"],
    attendantsError: null,
    jobTitlesApiError: null,
  };
  const { container } = render(<AttendantForm {...props} />);
  expect(container).toMatchSnapshot();
});

// TODO: add more tests
