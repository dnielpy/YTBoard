import { PageHeader } from "@/components/common/page-header";
import { MaitenancePage } from "@/components/system/maitenance-page";
import { getTranslations } from "next-intl/server";

export const YoutubeStatisticsContainer = async () => {
  const t = await getTranslations("youtube.statistics");

  return (
    <div>
      <PageHeader
        title={t("header.title")}
        pretitle={t("header.pretitle")}
        subtitle={t("header.subtitle")}
      ></PageHeader>
      <MaitenancePage></MaitenancePage>
    </div>
  );
};
