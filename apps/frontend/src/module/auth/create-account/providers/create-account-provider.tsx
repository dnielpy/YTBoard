"use client";

import { FormProps, FormProvider } from "@/components/ui/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchemaType } from "../schemas/register-schema";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { register as registerUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export const CreateAccountProvider: FC<FormProps> = ({
  children,
  ...props
}) => {
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema(tAuth)),
    mode: "onChange",
  });

  const handleSubmit = async (data: RegisterSchemaType) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
      });

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
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.detail === "User already exists") {
          form.setError("email", {
            type: "manual",
            message: tAuth("userAlreadyExists"),
          });
        } else {
          form.setError("root", {
            type: "manual",
            message: error.detail,
          });
        }
      } else {
        form.setError("root", {
          type: "manual",
          message: tAuth("unknownError"),
        });
      }
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
