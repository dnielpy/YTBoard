"use client";

import { FormProps, FormProvider } from "@/components/ui/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchemaType } from "../schemas/register-schema";
import { useTranslations } from "next-intl";

export const CreateAccountProvider: FC<FormProps> = ({
  children,
  ...props
}) => {
  const tAuth = useTranslations("auth");

  const handleSubmit = async (data: RegisterSchemaType) => {
    console.log("Register Data: ", data);
  };

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema(tAuth)),
    mode: "onChange",
  });

  return (
    <FormProvider
      methods={form}
      onSubmit={handleSubmit}
      className="w-full flex justify-center"
      {...props}
    >
      {children}
    </FormProvider>
  );
};
