import { useReducer, useRef } from "react";

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
  touched: Partial<Record<keyof Values, boolean>>;
  isSubmitting: boolean;
  handleChange: HandleChange<Values>;
  handleBlur: (field: keyof Values) => () => void;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  setField: (field: keyof Values, value: string) => void;
}

interface FormState<Values> {
  values: Values;
  errors: ValidationErrors<Values>;
  touched: Partial<Record<keyof Values, boolean>>;
  isSubmitting: boolean;
}

type FormAction<Values> =
  | {
      type: "change";
      field: keyof Values;
      value: string;
    }
  | {
      type: "blur";
      field: keyof Values;
    }
  | {
      type: "beforeSubmit";
    }
  | {
      type: "afterSubmit";
    };

export default function useForm<Values>(
  config: FormConfig<Values>,
): UseFormResult<Values> {
  const initialErrorsRef = useRef<ValidationErrors<Values>>();
  if (!initialErrorsRef.current) {
    const initialErrors = {};
    config.validate?.(config.initialValues, initialErrors);

    initialErrorsRef.current = initialErrors;
  }

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

        case "blur":
          return {
            ...state,
            touched: { ...state.touched, [action.field]: true },
          };

        case "beforeSubmit":
          const touched = {} as Partial<Record<keyof Values, boolean>>;
          for (const field in state.values) {
            touched[field] = true;
          }

          return {
            ...state,
            touched,
            isSubmitting: true,
          };

        case "afterSubmit":
          return {
            ...state,
            isSubmitting: false,
          };
      }
      return state;
    },
    {
      values: config.initialValues,
      errors: initialErrorsRef.current,
      touched: {},
      isSubmitting: false,
    },
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange: (field) => (event) => {
      dispatch({
        type: "change",
        field,
        value: event.target.value,
      });
    },
    handleBlur: (field) => () => {
      dispatch({
        type: "blur",
        field,
      });
    },
    handleSubmit: (event) => {
      if (event) {
        event.preventDefault();
      }

      dispatch({ type: "beforeSubmit" });

      if (isEmpty(state.errors)) {
        return;
      }

      config.onSubmit?.(state.values)?.then(() => {
        dispatch({ type: "afterSubmit" });
      });
    },
    setField: (field, value) => {
      dispatch({
        type: "change",
        field,
        value,
      });
    },
  };
}

function isEmpty(values: object) {
  for (const _field in values) {
    return true;
  }
  return false;
}
