import AttendantForm from "./AttendantForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorMessages from "../constants/errorMessages";

let props;
const jobTitles = ["Accountant", "Engineer", "Lawyer", "Teacher"];

const fillAndSubmitForm = async () => {
  userEvent.type(screen.getByTestId("name"), "John");
  userEvent.type(screen.getByTestId("last-name"), "Doe");
  userEvent.selectOptions(await screen.findByTestId("job-title"), "Engineer");
  userEvent.type(screen.getByTestId("age"), "40");
  userEvent.click(screen.getByTestId("submit"));
};
describe("<AttendantForm />", () => {
  beforeEach(() => {
    props = {
      isAttendantsLoading: false,
      isJobTitlesLoading: false,
      submitAttendant: jest.fn(),
      attendants: [],
      jobTitles: jobTitles,
      attendantsApiError: null,
      jobTitlesApiError: null,
    };
  });

  it("renders correctly on successful initial load", async () => {
    const { container } = render(<AttendantForm {...props} />);

    expect(screen.queryByTestId("job-titles-loader")).not.toBeInTheDocument();
    expect(screen.queryByTestId("attendants-loader")).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders attendants and job title loaders", async () => {
    render(
      <AttendantForm
        {...props}
        isAttendantsLoading={true}
        isJobTitlesLoading={true}
      />
    );

    expect(screen.getByTestId("job-titles-loader")).toBeInTheDocument();
    expect(screen.getByTestId("attendants-loader")).toBeInTheDocument();
  });

  it("renders error message when get job titles API call fails", async () => {
    render(
      <AttendantForm
        {...props}
        jobTitlesApiError={[ErrorMessages.FAILED_TO_GET_JOB_TITLES]}
      />
    );

    expect(
      screen.getByText(ErrorMessages.FAILED_TO_GET_JOB_TITLES)
    ).toBeInTheDocument();
  });

  it("does not render select job title dropdown when get job titles API call fails", () => {
    render(
      <AttendantForm
        {...props}
        jobTitlesApiError={[ErrorMessages.FAILED_TO_GET_JOB_TITLES]}
      />
    );
    expect(screen.queryByTestId("job-title")).not.toBeInTheDocument();
  });

  it("renders error message when get attendants API call fails", async () => {
    render(
      <AttendantForm
        {...props}
        attendantsApiError={[ErrorMessages.FAILED_TO_GET_ATTENDANTS]}
      />
    );

    fillAndSubmitForm();

    await waitFor(async () => {
      expect(
        screen.getByText(ErrorMessages.FAILED_TO_GET_ATTENDANTS)
      ).toBeInTheDocument();
    });
  });

  it("clears all fields and disables button on submit button click", async () => {
    render(<AttendantForm {...props} />);

    fillAndSubmitForm();
    await waitFor(async () => {
      expect(screen.getByTestId("name")).toHaveValue("");
    });
    expect(screen.getByTestId("last-name")).toHaveValue("");
    expect(screen.getByTestId("job-title")).toHaveValue("");
    expect(screen.queryByTestId("age").value).toBeFalsy();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for invalid name input", async () => {
    render(<AttendantForm {...props} />);

    userEvent.type(screen.getByTestId("name"), "John123");
    expect(screen.getByText(ErrorMessages.INVALID_NAME)).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for invalid last name input", async () => {
    render(<AttendantForm {...props} />);

    userEvent.type(screen.getByTestId("last-name"), "John888");
    expect(
      screen.getByText(ErrorMessages.INVALID_LAST_NAME)
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for empty job title on outside click", async () => {
    render(<AttendantForm {...props} />);

    userEvent.click(screen.getByTestId("job-title"));
    userEvent.click(screen.getByTestId("name"));
    await waitFor(() => {
      expect(
        screen.getByText(ErrorMessages.INVALID_JOB_TITLE)
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for invalid age", async () => {
    render(<AttendantForm {...props} />);

    userEvent.type(screen.getByTestId("age"), "12");
    await waitFor(() => {
      expect(screen.getByText(ErrorMessages.INVALID_AGE)).toBeInTheDocument();
    });

    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation for empty job title on outside click", async () => {
    render(<AttendantForm {...props} />);

    userEvent.click(screen.getByTestId("age"));
    userEvent.click(screen.getByTestId("last-name"));
    await waitFor(() => {
      expect(screen.getByText(ErrorMessages.INVALID_AGE)).toBeInTheDocument();
    });
  });

  it("calls submitAttendant function with correct arguments", async () => {
    render(<AttendantForm {...props} />);

    fillAndSubmitForm();

    await waitFor(() => {
      expect(props.submitAttendant).toHaveBeenCalledWith({
        name: "John",
        lastName: "Doe",
        jobTitle: "Engineer",
        age: "40",
      });
    });
  });
});
