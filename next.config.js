/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'taotaodaohang.taotaodaohang.cc',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 6000,
    contentDispositionType: 'inline',
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
}

module.exports = nextConfig