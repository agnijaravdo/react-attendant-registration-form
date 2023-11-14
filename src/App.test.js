import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import * as api from "./api";

const jobTitles = ["Accountant", "Engineer", "Lawyer", "Teacher"];

describe("<App />", () => {
  const getJobTitles = jest.spyOn(api, "getJobTitles");
  const addAttendant = jest.spyOn(api, "addAttendant");
  const getAttendants = jest.spyOn(api, "getAttendants");

  beforeEach(() => {
    getJobTitles.mockResolvedValue({
      status: 200,
      data: jobTitles,
    });
    addAttendant.mockResolvedValue({
      status: 200,
    });
    getAttendants.mockResolvedValue({
      status: 200,
      data: [],
    });
  });

  it("renders component correctly on successful initial load", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      expect(screen.queryByTestId("job-titles-loader")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("attendants-loader")).not.toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it("renders title", async () => {
    render(<App />);
    await waitFor(async () => {
      expect(
        await screen.findByText(/2023 React Fundamentals Workshop/i)
      ).toBeInTheDocument();
    });
  });

  it("calls getJobTitles and getAttendants API on initial load", async () => {
    render(<App />);

    await waitFor(() => {
      expect(getJobTitles).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(getAttendants).toHaveBeenCalledTimes(1);
    });
  });

  //TODO add tests for API errors, sorting, adding attendant and calling addAteendant API
});
