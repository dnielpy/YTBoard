import { ReactNode } from "react";

// Root layout is a passthrough — <html> and <body> live in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
