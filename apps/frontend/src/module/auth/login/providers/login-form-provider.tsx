"use client";

import { FormProps, FormProvider } from "@/components/ui/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "../schemas/login-schema";
import { useTranslations } from "next-intl";

export const LoginFormProvider: FC<FormProps> = ({ children, ...props }) => {
  const tAuth = useTranslations("auth");

  const handleSubmit = async (data: LoginSchemaType) => {
    console.log("Replace me with sign in logic");
  };

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema(tAuth)),
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
