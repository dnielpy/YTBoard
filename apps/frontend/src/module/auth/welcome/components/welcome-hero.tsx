import { BrandLockup } from "./brand-lockup";

export const WelcomeHero = ({ phaseIndex }: { phaseIndex: number }) => {
  return (
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
      <div className="mb-6">
        <BrandLockup />
      </div>
    </div>
  );
};
