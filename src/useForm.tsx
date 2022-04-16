import { useReducer } from "react";

type TextbaseElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

interface FormConfig<Values> {
  initialValues: Values;
  onSubmit: (values: Values) => void | Promise<void>;
}

interface HandleChange<Values> {
  (field: keyof Values): (event: React.ChangeEvent<TextbaseElement>) => void;
}

interface UseFormResult<Values> {
  values: Values;
  handleChange: HandleChange<Values>;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
}

interface FormState<Values> {
  values: Values;
}

type FormAction<Values> = {
  type: "change";
  field: keyof Values;
  value: string;
};

export default function useForm<Values>(
  config: FormConfig<Values>,
): UseFormResult<Values> {
  const [state, dispatch] = useReducer(
    (state: FormState<Values>, action: FormAction<Values>) => {
      switch (action.type) {
        case "change":
          return {
            ...state,
            values: {
              ...state.values,
              [action.field]: action.value,
            },
          };
      }
      return state;
    },
    {
      values: config.initialValues,
    },
  );

  return {
    values: state.values,
    handleChange: (field) => (event) => {
      dispatch({
        type: "change",
        field,
        value: event.target.value,
      });
    },
    handleSubmit: (event) => {
      if (event) {
        event.preventDefault();
      }
      config.onSubmit(state.values);
    },
  };
}
