/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    turbopack: {
      resolveAlias: {
        "@": "./src",
      },
    },
  },
}

module.exports = nextConfig
