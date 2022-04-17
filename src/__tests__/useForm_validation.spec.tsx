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
  describe("validation", () => {
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
  });
});
