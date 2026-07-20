/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  sassOptions: {
    includePaths: ['styles'],
  },
  images: {
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: '/clinical',
        destination: '/products/booklet',
        permanent: true,
      },
      {
        source: '/private-process',
        destination: '/personal-guidance',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
