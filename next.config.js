/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["image.mux.com"],
  }
};

module.exports = nextConfig;
