import { PageHeader } from "@/components/common/page-header";
import { getTranslations } from "next-intl/server";
import { MaitenancePage } from "@/components/system/maintenance-page";

export const YoutubeStatisticsContainer = async () => {
  const t = await getTranslations("youtube.statistics");

  return (
    <div>
      <PageHeader
        title={t("header.title")}
        pretitle={t("header.pretitle")}
        subtitle={t("header.subtitle")}
      />
      <div className="mt-6">
        <MaitenancePage></MaitenancePage>
      </div>
    </div>
  );
};
