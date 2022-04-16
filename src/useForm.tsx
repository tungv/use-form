import { useReducer } from "react";

type TextbaseElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

type ValidationErrors<Values> = Partial<Record<keyof Values, string>>;

interface FormConfig<Values> {
  initialValues: Values;
  onSubmit?: (values: Values) => void | Promise<void>;
  validate?: (values: Values, errors: ValidationErrors<Values>) => void;
}

interface HandleChange<Values> {
  (field: keyof Values): (event: React.ChangeEvent<TextbaseElement>) => void;
}

interface UseFormResult<Values> {
  values: Values;
  errors: ValidationErrors<Values>;
  handleChange: HandleChange<Values>;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
}

interface FormState<Values> {
  values: Values;
  errors: ValidationErrors<Values>;
}

type FormAction<Values> = {
  type: "change";
  field: keyof Values;
  value: string;
};

export default function useForm<Values>(
  config: FormConfig<Values>,
): UseFormResult<Values> {
  const initialErrors = {};
  config.validate?.(config.initialValues, initialErrors);

  const [state, dispatch] = useReducer(
    (state: FormState<Values>, action: FormAction<Values>) => {
      switch (action.type) {
        case "change":
          const newValues = { ...state.values, [action.field]: action.value };

          const errors = {} as ValidationErrors<Values>;
          config.validate?.(newValues, errors);

          return {
            ...state,
            values: newValues,
            errors,
          };
      }
      return state;
    },
    {
      values: config.initialValues,
      errors: initialErrors,
    },
  );

  return {
    values: state.values,
    errors: state.errors,
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

      if (isEmpty(state.errors)) {
        return;
      }
      config.onSubmit?.(state.values);
    },
  };
}

function isEmpty(values: object) {
  for (const _field in values) {
    return true;
  }
  return false;
}
