import { FormProvider as ReactHookFormProvider, type UseFormReturn } from "react-hook-form"

const FormProvider = ({ children, methods }: { children: React.ReactNode, methods: UseFormReturn }) => {
    return <ReactHookFormProvider {...methods}>{children}</ReactHookFormProvider>
}

export default FormProvider