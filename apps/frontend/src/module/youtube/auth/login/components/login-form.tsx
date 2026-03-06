import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormShell } from "./form-shell";

export const LoginForm = ({
  onBack,
  onGoRegister,
}: {
  onBack: () => void;
  onGoRegister: () => void;
}) => {
  const t = useTranslations("auth.login");
  const handleSubmit = (e: FormEvent) => e.preventDefault();

  return (
    <FormShell
      title={t("form.loginTitle")}
      subtitle={t("form.loginSubtitle")}
      onBack={onBack}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-email">{t("form.emailLabel")}</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder={t("form.emailPlaceholder")}
            aria-label={t("form.emailLabel")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-password">{t("form.passwordLabel")}</Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            placeholder={t("form.passwordPlaceholder")}
            aria-label={t("form.passwordLabel")}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-input bg-secondary/60 text-[10px] font-semibold text-foreground/80">
              ✓
            </span>
            {t("form.rememberMe")}
          </div>
          <button type="button" className="text-primary hover:underline">
            {t("form.forgotPassword")}
          </button>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 gap-2 bg-[#FF0000] text-[#FFFFFF] shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 hover:bg-[#CC0000] hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.45)]"
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
      </form>
    </FormShell>
  );
};
