import { routing } from "./routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
