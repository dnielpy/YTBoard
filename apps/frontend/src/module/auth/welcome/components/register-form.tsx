import { useTranslations } from "next-intl";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RHFInput } from "@/components/ui/rhf/rhf-input";

import { FormShell } from "./form-shell";

export const RegisterForm = ({
  onBack,
  onGoLogin,
}: {
  onBack: () => void;
  onGoLogin: () => void;
}) => {
  const t = useTranslations("auth.login");

  return (
    <FormShell
      title={t("form.registerTitle")}
      subtitle={t("form.registerSubtitle")}
      onBack={onBack}
    >
      <div className="flex flex-col gap-4">
        <RHFInput
          name="name"
          label={t("form.nameLabel")}
          placeholder={t("form.namePlaceholder")}
          required
          disabled={false}
          type="text"
          description=""
        />
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
        <RHFInput
          name="confirmPassword"
          label={t("form.confirmPasswordLabel")}
          placeholder={t("form.passwordPlaceholder")}
          required
          disabled={false}
          type="password"
          description=""
        />
        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-secondary/40 px-3 py-2 text-sm text-foreground">
          <Shield className="h-4 w-4 text-primary" />
          <span>{t("form.terms")}</span>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 gap-2 bg-[#FF0000] text-[#FFFFFF] shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 hover:bg-[#FF0000] hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.45)]"
        >
          <Lock className="h-4 w-4" />
          {t("form.submitRegister")}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t("form.hasAccount")}{" "}
          <button
            type="button"
            className="text-primary font-semibold hover:underline"
            onClick={onGoLogin}
          >
            {t("form.goLogin")}
          </button>
        </p>
      </div>
    </FormShell>
  );
};
