"use client";

import { useTranslations } from "next-intl";

import { useLoginAnimation } from "../hooks/use-login-animation";
import { SlideSection } from "../components/slide-section";
import { WelcomeHero } from "../components/welcome-hero";
import { HeroCTA } from "../components/hero-cta";
import { LoginContainer } from "../../login/containers/login-container";
import { RegisterContainer } from "../../create-account/containers/register-container";

export const WelcomeContainer = () => {
  const t = useTranslations("auth.login");
  const { phaseIndex, panel, setPanel, slideIndex } = useLoginAnimation();

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
              className="grid w-full"
              style={{
                gridTemplateRows: phaseIndex >= 1 ? "1fr" : "0fr",
                transition:
                  "grid-template-rows 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="overflow-hidden">
                <div
                  className="mt-2 max-w-xl mx-auto text-center"
                  style={{
                    opacity: phaseIndex >= 1 ? 1 : 0,
                    transform:
                      phaseIndex >= 1 ? "translateY(0)" : "translateY(20px)",
                    transition:
                      "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
                  }}
                >
                  <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {t("tagline.line1")}
                    <br />
                    <span className="text-foreground/80">
                      {t("tagline.line2")}
                    </span>
                  </p>
                </div>

                <HeroCTA
                  phaseIndex={phaseIndex}
                  onLogin={() => setPanel("login")}
                />
              </div>
            </div>
          </div>
        </SlideSection>

        <SlideSection active={panel === "login"}>
          <LoginContainer
            onBack={() => setPanel("welcome")}
            onGoRegister={() => setPanel("register")}
          />
        </SlideSection>

        <SlideSection active={panel === "register"}>
          <RegisterContainer
            onBack={() => setPanel("welcome")}
            onGoLogin={() => setPanel("login")}
          />
        </SlideSection>
      </div>
    </main>
  );
};
