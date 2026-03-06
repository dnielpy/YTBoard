import type { FeatureCardProps } from "../types/login.types";

export const FeatureCard = ({
  icon,
  title,
  description,
  delay,
  isVisible,
}: FeatureCardProps) => {
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
};
