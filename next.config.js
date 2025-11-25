/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
    domains: [
      "zvxxdmfljbtlenjatqgm.supabase.co",
      "supabase.co",
    ],
  },
};

module.exports = nextConfig;
