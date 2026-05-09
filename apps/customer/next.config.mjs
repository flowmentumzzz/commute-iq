/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@commute-iq/domain", "@commute-iq/supabase", "@commute-iq/ui"]
};

export default nextConfig;
