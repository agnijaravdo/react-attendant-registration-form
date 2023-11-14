import Attendant from "./Attendant";
import { render, screen } from "@testing-library/react";

describe("<Attendant />", () => {
  let props;

  beforeEach(() => {
    props = {
      attendant: {
        name: "John",
        lastName: "Doe",
        jobTitle: "Engineer",
        age: 40,
      },
    };
  });

  it("renders correctly on successful initial load", async () => {
    const { container } = render(<Attendant {...props} />);

    expect(container).toMatchSnapshot();
  });

  it("renders component with given props", async () => {
    render(<Attendant {...props} />);

    expect(await screen.findByText("John")).toBeInTheDocument();
    expect(await screen.findByText("Doe")).toBeInTheDocument();
    expect(await screen.findByText("Engineer")).toBeInTheDocument();
    expect(await screen.findByText("40")).toBeInTheDocument();
  });
});
