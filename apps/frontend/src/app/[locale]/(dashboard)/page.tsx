import { getTranslations } from "next-intl/server";

export default async function Welcome() {
  const t = await getTranslations("home");

  return <h1>{t("title")}</h1>;
}
