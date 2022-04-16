interface FormConfig<Values> {
  initialValues: Values;
}

interface UseFormResult<Values> {
  values: Values;
  handleChange: (field: keyof Values) => (event: React.ChangeEvent) => void;
}

export default function useForm<Values>(
  config: FormConfig<Values>,
): UseFormResult<Values> {
  return {
    values: config.initialValues,
    handleChange: () => () => {},
  };
}
