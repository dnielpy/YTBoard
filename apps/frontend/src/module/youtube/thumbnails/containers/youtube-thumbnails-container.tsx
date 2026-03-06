import { PageHeader } from "@/components/common/page-header";
import { getTranslations } from "next-intl/server";
import { ThumbnailEditor } from "../components/thumbnail-editor";

export const YoutubeThumbnailsContainer = async () => {
  const t = await getTranslations("youtube.thumbnails");

  return (
    <div>
      <PageHeader
        title={t("header.title")}
        pretitle={t("header.pretitle")}
        subtitle={t("header.subtitle")}
      ></PageHeader>
      <ThumbnailEditor />
    </div>
  );
};
