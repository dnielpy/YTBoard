import { BrandLockup } from "./brand-lockup";

export const WelcomeHero = ({ phaseIndex }: { phaseIndex: number }) => {
  const isCentered = phaseIndex === 0;

  return (
    <div
      className="flex flex-col items-center"
      style={{
        opacity: 1,
        transform: isCentered ? "scale(2.2)" : "scale(1.7)",
        transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="mb-6">
        <BrandLockup />
      </div>
    </div>
  );
};
