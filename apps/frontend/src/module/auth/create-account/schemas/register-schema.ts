import { TFunction } from "@/lib/types/intl";
import z from "zod";

export const registerSchema = (t: TFunction) =>
  z
    .object({
      name: z.string().min(1, {
        message: t("nameRequired"),
      }),
      email: z.string().email({
        message: t("emailInvalid"),
      }),
      password: z.string().min(8, {
        message: t("passwordMinLength"),
      }),
      confirmPassword: z.string().min(1, {
        message: t("confirmPasswordRequired"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });

export type RegisterSchemaType = z.infer<ReturnType<typeof registerSchema>>;
