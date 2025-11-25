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

  // Fix for Resend and @react-email packages in App Router
  experimental: {
    serverComponentsExternalPackages: ['resend', '@react-email/render', '@react-email/components'],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark resend-related packages as external for server bundles
      config.externals = config.externals || [];
      config.externals.push({
        'resend': 'commonjs resend',
        '@react-email/render': 'commonjs @react-email/render',
        '@react-email/components': 'commonjs @react-email/components',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
