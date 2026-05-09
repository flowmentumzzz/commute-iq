import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@commute-iq/domain", "@commute-iq/supabase", "@commute-iq/ui"]
};

export default withNextIntl(nextConfig);
