import Attendant from "./Attendant";
import { render } from "@testing-library/react";

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

  it("renders component correctly when data is loaded", async () => {
    const { container } = render(<Attendant {...props} />);
    expect(container).toMatchSnapshot();
  });
});
