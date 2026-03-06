import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormShell } from "./form-shell";

export const RegisterForm = ({
  onBack,
  onGoLogin,
}: {
  onBack: () => void;
  onGoLogin: () => void;
}) => {
  const t = useTranslations("auth.login");
  const handleSubmit = (e: FormEvent) => e.preventDefault();

  return (
    <FormShell
      title={t("form.registerTitle")}
      subtitle={t("form.registerSubtitle")}
      onBack={onBack}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-name">{t("form.nameLabel")}</Label>
          <Input
            id="register-name"
            name="name"
            placeholder={t("form.namePlaceholder")}
            aria-label={t("form.nameLabel")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-email">{t("form.emailLabel")}</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder={t("form.emailPlaceholder")}
            aria-label={t("form.emailLabel")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-password">{t("form.passwordLabel")}</Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder={t("form.passwordPlaceholder")}
            aria-label={t("form.passwordLabel")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-confirm">
            {t("form.confirmPasswordLabel")}
          </Label>
          <Input
            id="register-confirm"
            name="confirm"
            type="password"
            placeholder={t("form.passwordPlaceholder")}
            aria-label={t("form.confirmPasswordLabel")}
          />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-secondary/40 px-3 py-2 text-sm text-foreground">
          <Shield className="h-4 w-4 text-primary" />
          <span>{t("form.terms")}</span>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 gap-2 bg-[#FF0000] text-[#FFFFFF] shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 hover:bg-[#CC0000] hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.45)]"
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
      </form>
    </FormShell>
  );
};
