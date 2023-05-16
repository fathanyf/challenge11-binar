/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'wallpapercave.com',
      'firebasestorage.googleapis.com',
      'static8.depositphotos.com',
      'upload.wikimedia.org',
      'learnenglishkids.britishcouncil.org',
    ],
  },
};

module.exports = nextConfig;
