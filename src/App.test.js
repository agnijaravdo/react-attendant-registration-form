import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
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

  it("renders component correctly when data is loaded", async () => {
    const { container } = render(<App />);

    await waitForElementToBeRemoved(
      screen.queryByText("Loading job titles... 🔄"),
    );
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders title", async () => {
    render(<App />);

    await waitFor(async () => {
      expect(
        await screen.findByText(/2023 React Fundamentals Workshop/i),
      ).toBeInTheDocument();
    });
  });

  it("calls getJobTitles and getAttendants API when data is loaded", async () => {
    render(<App />);

    await waitFor(() => expect(getJobTitles).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(getAttendants).toHaveBeenCalledTimes(1));
  });

  it("renders attendants loader", async () => {
    render(<App />);

    await waitFor(async () => {
      expect(await screen.findByText("Loading...")).toBeInTheDocument();
    });
  });

  it("renders error message when get attendants API call fails", async () => {
    getAttendants.mockRejectedValue({ status: 500 });
    render(<App />);

    expect(
      await screen.findByText("Failed to get attendants"),
    ).toBeInTheDocument();
  });

  it("handles successful get attendants API call", async () => {
    getAttendants.mockResolvedValue({ status: 200, data: [{ name: "John" }] });
    render(<App />);

    expect(await screen.findByText("John")).toBeInTheDocument();
  });

  test("handles successful get job titles API call", async () => {
    getJobTitles.mockResolvedValue({ status: 200, data: jobTitles });
    render(<App />);
    expect(await screen.findByText("Accountant")).toBeInTheDocument();
    expect(await screen.findByText("Engineer")).toBeInTheDocument();
  });

  it("renders error message when get job titles API call fails", async () => {
    getJobTitles.mockRejectedValue({ status: 500 });
    render(<App />);

    expect(
      await screen.findByText("Failed to get job titles"),
    ).toBeInTheDocument();
  });

  it("sorts attendants by age", async () => {
    getAttendants.mockResolvedValue({
      status: 200,
      data: [
        { name: "John", age: 55 },
        { name: "Julia", age: 25 },
      ],
    });
    render(<App />);

    const attendants = await screen.findAllByTestId("attendant");

    expect(attendants[0]).toHaveTextContent("Julia");
    expect(attendants[1]).toHaveTextContent("John");
  });
});
