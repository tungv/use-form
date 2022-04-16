import { ChangeEvent, useReducer } from "react";

export default function useField(initialValue = "") {
  const [value, onChange] = useReducer(
    (_value: string, event: ChangeEvent<HTMLInputElement>) =>
      event.target.value,
    initialValue,
  );

  return { value, onChange };
}
