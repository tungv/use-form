import * as React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import useField from "../useField";

describe("useField", () => {
  it("should return render empty input if no initial value provided", () => {
    function MyComponent() {
      const { value, onChange } = useField();

      return <input type="text" value={value} onChange={onChange} />;
    }

    const { getByRole } = render(<MyComponent />);

    const input = getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("should return render initial input if initial value provided", () => {
    function MyComponent() {
      const { value, onChange } = useField("hello");

      return <input type="text" value={value} onChange={onChange} />;
    }

    const { getByRole } = render(<MyComponent />);

    const input = getByRole("textbox");
    expect(input).toHaveValue("hello");
  });

  it("should update value on input change", () => {
    function MyComponent() {
      const { value, onChange } = useField("hello");

      return <input type="text" value={value} onChange={onChange} />;
    }

    const { getByRole } = render(<MyComponent />);

    const input = getByRole("textbox");
    expect(input).toHaveValue("hello");

    fireEvent.change(input, { target: { value: "world" } });
    expect(input).toHaveValue("world");
  });

  it("should work with select", () => {
    function MyComponent() {
      const { value, onChange } = useField("hello");

      return (
        <select value={value} onChange={onChange}>
          <option value="hello">Hello</option>
          <option value="world">World</option>
        </select>
      );
    }

    const { getByRole } = render(<MyComponent />);

    const select = getByRole("combobox");
    expect(select).toHaveValue("hello");

    fireEvent.change(select, { target: { value: "world" } });
    expect(select).toHaveValue("world");
  });
});
