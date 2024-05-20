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
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
}

module.exports = nextConfig