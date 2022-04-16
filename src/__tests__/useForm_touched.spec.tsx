import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";

import useForm from "../useForm";

describe("useForm", () => {
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

      // submit form and expect error messages
      fireEvent.click(getByText("Login"));
      expect(getByText("Username Required")).toBeInTheDocument();
      expect(getByText("Password Required")).toBeInTheDocument();
    });
  });
});
