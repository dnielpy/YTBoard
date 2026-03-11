import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { geistMono, geistSans } from "@/app/fonts";
import { generateStaticParams } from "@/app/i18n/generate-static-params";
import type { ReactNode } from "react";
import "@/app/globals.css";

export { generateStaticParams };

export const metadata: Metadata = {
  title: "YTBoard Login",
  description: "Acceso a YTBoard",
};

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Providers locale={locale}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </div>
    </Providers>
  );
}
