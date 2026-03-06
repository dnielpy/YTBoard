import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RHFInput } from "@/components/ui/rhf/rhf-input";

import { FormShell } from "./form-shell";

export const LoginForm = ({
  onBack,
  onGoRegister,
}: {
  onBack: () => void;
  onGoRegister: () => void;
}) => {
  const t = useTranslations("auth.login");

  return (
    <FormShell
      title={t("form.loginTitle")}
      subtitle={t("form.loginSubtitle")}
      onBack={onBack}
    >
      <div className="flex flex-col gap-4">
        <RHFInput
          name="email"
          label={t("form.emailLabel")}
          placeholder={t("form.emailPlaceholder")}
          required
          disabled={false}
          type="email"
          description=""
        />
        <RHFInput
          name="password"
          label={t("form.passwordLabel")}
          placeholder={t("form.passwordPlaceholder")}
          required
          disabled={false}
          type="password"
          description=""
        />
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground"></div>
          <button type="button" className="text-primary hover:underline">
            {t("form.forgotPassword")}
          </button>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 gap-2 bg-[#FF0000] text-[#FFFFFF] shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 hover:bg-[#FF0000] hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.45)]"
        >
          <Lock className="h-4 w-4" />
          {t("form.submitLogin")}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t("form.noAccount")}{" "}
          <button
            type="button"
            className="text-primary font-semibold hover:underline"
            onClick={onGoRegister}
          >
            {t("form.goRegister")}
          </button>
        </p>
      </div>
    </FormShell>
  );
};
