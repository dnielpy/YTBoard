"use client";

import { useTranslations } from "next-intl";

import { useLoginAnimation } from "../hooks/use-login-animation";
import { SlideSection } from "../components/slide-section";
import { WelcomeHero } from "../components/welcome-hero";
import { FeatureGrid } from "../components/feature-grid";
import { HeroCTA } from "../components/hero-cta";
import { LoginForm } from "../components/login-form";
import { RegisterForm } from "../components/register-form";

export const LoginContainer = () => {
  const t = useTranslations("auth.login");
  const { phaseIndex, featuresVisible, panel, setPanel, slideIndex } =
    useLoginAnimation();

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      <div
        className="pointer-events-none fixed top-1/2 left-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.63 0.25 29) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.97 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.97 0 0) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div
        className="relative z-10 flex w-full flex-col"
        style={{
          height: "300dvh",
          transform: `translateY(-${slideIndex * 100}dvh)`,
          transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <SlideSection active={panel === "welcome"}>
          <div className="flex w-full max-w-4xl flex-col items-center">
            <WelcomeHero phaseIndex={phaseIndex} />

            <div
              className="mt-2 max-w-xl text-center"
              style={{
                opacity: phaseIndex >= 1 ? 1 : 0,
                transform:
                  phaseIndex >= 1 ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}
            >
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t("tagline.line1")}
                <br />
                <span className="text-foreground/80">{t("tagline.line2")}</span>
              </p>
            </div>

            <FeatureGrid phaseIndex={phaseIndex} visible={featuresVisible} />

            <HeroCTA
              phaseIndex={phaseIndex}
              onLogin={() => setPanel("login")}
              onRegister={() => setPanel("register")}
            />

            <div
              className="mt-20 h-px w-full max-w-xs"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.63 0.25 29 / 0.3), transparent)",
                opacity: phaseIndex >= 3 ? 1 : 0,
                transition: "opacity 1s ease 0.5s",
              }}
            />
          </div>
        </SlideSection>

        <SlideSection active={panel === "login"}>
          <div className="w-full max-w-3xl flex justify-center align-center">
            <LoginForm
              onBack={() => setPanel("welcome")}
              onGoRegister={() => setPanel("register")}
            />
          </div>
        </SlideSection>

        <SlideSection active={panel === "register"}>
          <div className="w-full max-w-3xl flex justify-center align-center">
            <RegisterForm
              onBack={() => setPanel("welcome")}
              onGoLogin={() => setPanel("login")}
            />
          </div>
        </SlideSection>
      </div>
    </main>
  );
};
