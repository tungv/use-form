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

  it("should handle submit", () => {
    const onSubmit = jest.fn();

    const { getByLabelText, getByRole } = render(
      <MyForm onSubmit={onSubmit} />,
    );

    const usernameInput = getByLabelText("username");
    const passwordInput = getByLabelText("password");

    fireEvent.change(usernameInput, { target: { value: "hello" } });
    fireEvent.change(passwordInput, { target: { value: "world" } });

    fireEvent.click(getByRole("button"));

    expect(onSubmit).toHaveBeenCalledWith({
      username: "hello",
      password: "world",
    });
  });

  it("should validate before submit", () => {
    const onSubmit = jest.fn();

    const { getByLabelText, getByRole, getByText } = render(
      <MyForm onSubmit={onSubmit} />,
    );

    const passwordInput = getByLabelText("password");

    fireEvent.change(passwordInput, { target: { value: "www" } });

    fireEvent.click(getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();

    // find error messages
    expect(getByText("Username Required")).toBeInTheDocument();
    expect(
      getByText("Password must be at least 4 characters"),
    ).toBeInTheDocument();
  });

  it("should validate on init", () => {
    const { getByLabelText, getByText } = render(<MyForm />);

    const passwordInput = getByLabelText("password");

    expect(passwordInput).toHaveValue("");

    expect(getByText("Username Required")).toBeInTheDocument();
    expect(getByText("Password Required")).toBeInTheDocument();
  });

  it("should not run validate agaist initial values on update", () => {
    const validate = jest.fn();

    function TestForm() {
      useForm({
        initialValues: {
          test: "value",
        },
        validate,
      });

      return <span>nothing</span>;
    }

    const { rerender } = render(<TestForm />);
    expect(validate).toHaveBeenCalledTimes(1);

    rerender(<TestForm />);
    expect(validate).toHaveBeenCalledTimes(1);
  });

  describe("touched status", () => {
    function TestForm() {
      const form = useForm({
        initialValues: { username: "", password: "" },
        validate(values, errors) {
          if (!values.username) {
            errors.username = "Username Required";
          }
          if (!values.password) {
            errors.password = "Password Required";
          }
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
              onBlur={form.handleBlur("username")}
            />
            {form.errors.username && form.touched.username && (
              <span>{form.errors.username}</span>
            )}
          </div>
          <div>
            <input
              type="password"
              aria-label="password"
              value={form.values.password}
              onChange={form.handleChange("password")}
              onBlur={form.handleBlur("password")}
            />
            {form.errors.password && form.touched.password && (
              <span>{form.errors.password}</span>
            )}
          </div>
          <button type="submit">Login</button>
        </form>
      );
    }

    it("should keep track of touched status", () => {
      const { getByLabelText, queryByText, getByText } = render(<TestForm />);
      const usernameInput = getByLabelText("username");

      // expect no error messages
      // getByText will throw if the element is not found
      // queryByText will return null if the element is not found
      expect(queryByText("Username Required")).toBeNull();
      expect(queryByText("Password Required")).toBeNull();

      fireEvent.focus(usernameInput);
      expect(queryByText("Username Required")).toBeNull();

      fireEvent.blur(usernameInput);
      expect(getByText("Username Required")).toBeInTheDocument();

      expect(queryByText("Password Required")).toBeNull();
    });
  });
});
