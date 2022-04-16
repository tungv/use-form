import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";

import useForm from "../useForm";

describe("useForm", () => {
  it("should render multiple fields", () => {
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

    const { getByLabelText } = render(<MyForm />);

    expect(getByLabelText("username")).toHaveValue("");
    expect(getByLabelText("password")).toHaveValue("");
  });
});
