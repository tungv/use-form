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
  describe("handleSubmit", () => {
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
  });
});
