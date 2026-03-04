"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, Users, TrendingUp, Video, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M27.4 3.1C27.1 2 26.2 1.1 25.1 0.8C22.9 0.2 14 0.2 14 0.2C14 0.2 5.1 0.2 2.9 0.8C1.8 1.1 0.9 2 0.6 3.1C0 5.3 0 10 0 10C0 10 0 14.7 0.6 16.9C0.9 18 1.8 18.9 2.9 19.2C5.1 19.8 14 19.8 14 19.8C14 19.8 22.9 19.8 25.1 19.2C26.2 18.9 27.1 18 27.4 16.9C28 14.7 28 10 28 10C28 10 28 5.3 27.4 3.1Z"
        fill="#FF0000"
      />
      <path d="M11.2 14.2L18.5 10L11.2 5.8V14.2Z" fill="white" />
    </svg>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
  isVisible: boolean;
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
  isVisible,
}: FeatureCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/40 hover:bg-secondary/60"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--primary)_0%,_transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]" />
      <div className="relative">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 font-mono text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Analytics Avanzados",
    description:
      "Visualiza el rendimiento de cada video con datos en tiempo real y tendencias clave.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Audiencia",
    description:
      "Conoce a tu audiencia, de donde vienen, que les gusta y cuando estan activos.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Crecimiento",
    description:
      "Rastrea tu crecimiento de suscriptores y vistas con proyecciones inteligentes.",
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: "Gestion de Videos",
    description:
      "Administra todos tus videos, thumbnails y metadatos desde un solo lugar.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Monitoreo en Vivo",
    description:
      "Observa el rendimiento de tus videos en las primeras horas criticas de publicacion.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Acciones Rapidas",
    description:
      "Automatiza tareas repetitivas y optimiza tu flujo de trabajo como creador.",
  },
];

type Phase = "logo" | "tagline" | "features" | "cta";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/auth/welcome";

  const [phase, setPhase] = useState<Phase>("logo");
  const [featuresVisible, setFeaturesVisible] = useState(false);

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      if (prev === "logo") return "tagline";
      if (prev === "tagline") {
        setTimeout(() => setFeaturesVisible(true), 200);
        return "features";
      }
      return "cta";
    });
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => advancePhase(), 1500),
      setTimeout(() => advancePhase(), 3200),
      setTimeout(() => setPhase("cta"), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [advancePhase]);

  const phaseIndex = ["logo", "tagline", "features", "cta"].indexOf(phase);
  const stackOffset = phaseIndex === 0 ? 260 : phaseIndex === 1 ? 140 : 40;

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.63 0.25 29) 0%, transparent 70%)",
          transition: "opacity 2s ease",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.97 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.97 0 0) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center"
        style={{
          transform: `translateY(${stackOffset}px)`,
          transition: "transform 1.2s ease",
        }}
      >
        <div
          className="flex flex-col items-center transition-all duration-700 ease-out"
          style={{
            opacity: phaseIndex >= 0 ? 1 : 0,
            transform:
              phaseIndex === 0
                ? "translateY(0) scale(1.9)"
                : "translateY(-4px) scale(1.15)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <YoutubeIcon className="h-7 w-auto" />
            </div>
            <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              YTBoard
            </h1>
          </div>
        </div>

        <div
          className="mt-2 max-w-xl text-center"
          style={{
            opacity: phaseIndex >= 1 ? 1 : 0,
            transform: phaseIndex >= 1 ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            El centro de control definitivo para tu canal de YouTube.
            <br />
            <span className="text-foreground/80">
              Analiza. Gestiona. Crece.
            </span>
          </p>
        </div>

        <div
          className="mt-12 w-full"
          style={{
            opacity: phaseIndex >= 2 ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 120}
                isVisible={featuresVisible}
              />
            ))}
          </div>
        </div>

        <div
          className="mt-14 flex flex-col items-center gap-4"
          style={{
            opacity: phaseIndex >= 3 ? 1 : 0,
            transform: phaseIndex >= 3 ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <Button
            size="lg"
            className="group relative h-14 cursor-pointer gap-3 overflow-hidden rounded-xl bg-[#FF0000] px-8 text-base font-semibold text-[#FFFFFF] shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 hover:bg-[#CC0000] hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.45)]"
            // onClick={() => signIn("google", { callbackUrl })}
          >
            <YoutubeIcon className="h-5 w-auto transition-transform duration-300 group-hover:scale-110" />
            Iniciar sesion con YouTube
          </Button>
          <p className="text-xs text-muted-foreground">
            Conecta tu cuenta de forma segura con OAuth 2.0
          </p>
        </div>

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
    </main>
  );
}
