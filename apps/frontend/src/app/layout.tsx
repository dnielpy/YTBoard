import { ReactNode } from "react";
import { cookies } from "next/headers";
import { routing } from "@/app/i18n/routing";
import { geistMono, geistSans } from "@/app/fonts";
import "@/app/globals.css";

type Locale = (typeof routing.locales)[number];

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = routing.locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : routing.defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ytb-theme");if(t==="light"||t==="dark"){if(t==="dark")document.documentElement.classList.add("dark");return;}if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark")}else{document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
