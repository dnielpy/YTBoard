import { getTranslations } from "next-intl/server";

export default async function Welcome() {
  const t = await getTranslations("home");

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center gap-2">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
    </section>
  );
}
