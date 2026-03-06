import type { ReactNode } from "react";

export const SlideSection = ({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) => {
  return (
    <section
      className="flex h-dvh w-full shrink-0 items-center justify-center px-4"
      aria-hidden={!active}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {children}
    </section>
  );
};
