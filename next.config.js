const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/sneakers-store-images/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For debugging purposes
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
