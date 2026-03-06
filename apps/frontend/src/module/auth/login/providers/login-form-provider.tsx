"use client";

import { FormProps, FormProvider } from "@/components/ui/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "../schemas/login-schema";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LoginFormProvider: FC<FormProps> = ({ children, ...props }) => {
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema(tAuth)),
    mode: "onChange",
  });

  const handleSubmit = async (data: LoginSchemaType) => {
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        form.setError("root", {
          type: "manual",
          message: tAuth("unknownError"),
        });
      } else {
        router.push("/");
      }
    } catch {
      form.setError("root", {
        type: "manual",
        message: tAuth("unknownError"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
