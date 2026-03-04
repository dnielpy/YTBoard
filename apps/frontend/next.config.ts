import createNextIntlPlugin from "next-intl/plugin";

// Point the plugin to the actual request config location under src/app/i18n
const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");

export default withNextIntl({
  /* tu nextConfig */
});
