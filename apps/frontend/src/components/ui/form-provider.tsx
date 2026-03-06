import { PropsWithChildren } from "react";
import {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
  FormProvider as Form,
  SubmitErrorHandler,
} from "react-hook-form";

export type FormProps = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "action"
>;

type Props<T extends FieldValues> = PropsWithChildren &
  FormProps & {
    methods: UseFormReturn<T>;
    onSubmit?: SubmitHandler<T>;
    id?: string;
    action?: string;
    onFormErrors?: SubmitErrorHandler<T>;
  };

export function FormProvider<T extends FieldValues>({
  methods,
  onSubmit,
  children,
  id,
  action,
  onFormErrors,
  ...props
}: Props<T>) {
  const handleError: SubmitErrorHandler<T> = (errors) => {
    console.error("Form Errors:", errors);
    onFormErrors?.(errors);
  };

  if (onSubmit) {
    return (
      <Form {...methods}>
        <form
          {...props}
          id={id}
          action={action}
          onSubmit={methods.handleSubmit(onSubmit, handleError)}
        >
          {children}
        </form>
      </Form>
    );
  }

  return <Form {...methods}>{children}</Form>;
}
