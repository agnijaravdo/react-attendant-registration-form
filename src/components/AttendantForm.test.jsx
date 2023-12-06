import AttendantForm from "./AttendantForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorMessages from "../constants/errorMessages";

const fillAndSubmitForm = async () => {
  await userEvent.type(screen.getByTestId("name"), "John");
  await userEvent.type(screen.getByTestId("last-name"), "Doe");
  await userEvent.selectOptions(
    await screen.findByTestId("job-title"),
    "Engineer",
  );
  await userEvent.type(screen.getByTestId("age"), "40");
  await userEvent.click(screen.getByTestId("submit"));
};

describe("<AttendantForm />", () => {
  let props;

  beforeEach(() => {
    props = {
      isAttendantsLoading: false,
      isJobTitlesLoading: false,
      submitAttendant: jest.fn(),
      jobTitles: ["Accountant", "Engineer", "Lawyer", "Teacher"],
      jobTitlesApiError: null,
    };
  });

  it("renders correctly when data is loaded", async () => {
    const { container } = render(<AttendantForm {...props} />);

    expect(screen.queryByTestId("job-titles-loader")).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders job title loader", async () => {
    render(<AttendantForm {...props} isJobTitlesLoading={true} />);

    expect(screen.getByTestId("job-titles-loader")).toBeInTheDocument();
  });

  it("renders error message when get job titles API call fails", async () => {
    render(
      <AttendantForm
        {...props}
        jobTitlesApiError={ErrorMessages.FAILED_TO_GET_JOB_TITLES}
      />,
    );

    expect(screen.getByText("Failed to get job titles")).toBeInTheDocument();
  });

  it("does not render select job title dropdown when get job titles API call fails", () => {
    render(
      <AttendantForm
        {...props}
        jobTitlesApiError={ErrorMessages.FAILED_TO_GET_JOB_TITLES}
      />,
    );

    expect(screen.queryByTestId("job-title")).not.toBeInTheDocument();
  });

  it("clears all fields and disables button when clicking on submit button", async () => {
    render(<AttendantForm {...props} />);

    fillAndSubmitForm();
    await waitFor(async () => {
      expect(await screen.findByTestId("name")).toHaveValue("");
    });
    expect(screen.getByTestId("last-name")).toHaveValue("");
    expect(screen.getByTestId("job-title")).toHaveValue("");
    expect(screen.queryByTestId("age").value).toBeFalsy();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for invalid name input", async () => {
    render(<AttendantForm {...props} />);

    userEvent.type(screen.getByTestId("name"), "John123");
    expect(
      screen.getByText(
        "Please enter a valid name. It should be 2-50 characters long",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for invalid last name input", async () => {
    render(<AttendantForm {...props} />);

    userEvent.type(screen.getByTestId("last-name"), "D");
    expect(
      screen.getByText(
        "Please enter a valid last name. It should be 2-50 characters long",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for empty job title when clicking outside", async () => {
    render(<AttendantForm {...props} />);

    userEvent.click(screen.getByTestId("job-title"));
    userEvent.click(screen.getByTestId("name"));
    expect(screen.getByText("Please select a job title")).toBeInTheDocument();

    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation error for invalid age", async () => {
    render(<AttendantForm {...props} />);

    userEvent.type(screen.getByTestId("age"), "12");
    expect(
      screen.getByText("Please enter a valid age with range 15-120"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows validation for empty job title when clicking outside", async () => {
    render(<AttendantForm {...props} />);

    userEvent.click(screen.getByTestId("age"));
    userEvent.click(screen.getByTestId("last-name"));
    expect(
      screen.getByText("Please enter a valid age with range 15-120"),
    ).toBeInTheDocument();
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
