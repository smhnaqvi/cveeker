import { FormProvider as ReactHookFormProvider, type UseFormReturn, type FieldValues } from "react-hook-form"

type FormProviderProps<T extends FieldValues> = {
  children: React.ReactNode;
  onSubmit: (data: T) => void;
  methods: UseFormReturn<T>;
};

function FormProvider<T extends FieldValues>({
  children,
  methods,
  onSubmit,
}: FormProviderProps<T>) {
  return (
    <ReactHookFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </ReactHookFormProvider>
  );
}

export default FormProvider