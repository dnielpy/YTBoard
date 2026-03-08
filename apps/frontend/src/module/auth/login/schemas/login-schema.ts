import { TFunction } from "../../../../lib/types/intl";
import z from "zod";

export const loginSchema = (t: TFunction) =>
  z.object({
    email: z.string().email({
      message: t("emailInvalid"),
    }),
    password: z.string().min(1, {
      message: t("passwordRequired"),
    }),
  });

export type LoginSchemaType = z.infer<ReturnType<typeof loginSchema>>;
