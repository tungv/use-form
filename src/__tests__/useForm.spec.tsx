import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";

import useForm from "../useForm";

function MyForm({ onSubmit }: { onSubmit?: (values: any) => void }) {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate(values, errors) {
      if (!values.username) {
        errors.username = "Username Required";
      }
      if (!values.password) {
        errors.password = "Password Required";
      } else if (values.password.length < 4) {
        errors.password = "Password must be at least 4 characters";
      }
    },
    onSubmit(values) {
      onSubmit?.(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <input
          type="text"
          aria-label="username"
          name="username"
          value={form.values.username}
          onChange={form.handleChange("username")}
        />
        {form.errors.username && <span>{form.errors.username}</span>}
      </div>
      <div>
        <input
          type="password"
          aria-label="password"
          value={form.values.password}
          onChange={form.handleChange("password")}
        />
        {form.errors.password && <span>{form.errors.password}</span>}
      </div>
      <button type="submit">Login</button>
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

  it("should update values if handleChange is called", () => {
    function MyControlledForm() {
      const form = useForm({
        initialValues: {
          username: "",
          password: "",
        },
      });

      return (
        <form onSubmit={form.handleSubmit}>
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
          <button
            onClick={() => {
              form.setField("username", "tung");
            }}
          >
            Set Name
          </button>
        </form>
      );
    }

    const { getByLabelText, getByText } = render(<MyControlledForm />);

    const usernameInput = getByLabelText("username");
    const passwordInput = getByLabelText("password");
    const setNameButton = getByText("Set Name");

    expect(usernameInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");

    fireEvent.click(setNameButton);

    expect(usernameInput).toHaveValue("tung");
    expect(passwordInput).toHaveValue("");
  });
});
