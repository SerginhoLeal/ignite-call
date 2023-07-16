/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: [
    'page.tsx',
    'api.ts',
    'api.tsx'
  ],
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  }
}

module.exports = nextConfig
