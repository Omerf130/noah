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
}

module.exports = nextConfig

