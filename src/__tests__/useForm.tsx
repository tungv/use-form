import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";

import useForm from "../useForm";

function MyForm() {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  return (
    <form>
      <input
        type="text"
        aria-label="username"
        name="username"
        value={form.values.username}
        onChange={form.handleChange("username")}
      />
      <input
        type="password"
        aria-label="password"
        value={form.values.password}
        onChange={form.handleChange("password")}
      />
    </form>
  );
}

describe("useForm", () => {
  it("should render multiple fields", () => {
    const { getByLabelText } = render(<MyForm />);

    expect(getByLabelText("username")).toHaveValue("");
    expect(getByLabelText("password")).toHaveValue("");
  });

  it("should update values on input change", () => {
    const { getByLabelText } = render(<MyForm />);

    const usernameInput = getByLabelText("username");
    const passwordInput = getByLabelText("password");

    expect(usernameInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");

    fireEvent.change(usernameInput, { target: { value: "hello" } });
    expect(usernameInput).toHaveValue("hello");

    fireEvent.change(passwordInput, { target: { value: "world" } });
    expect(passwordInput).toHaveValue("world");
  });
});
