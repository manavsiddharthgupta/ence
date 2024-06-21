/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ence-invoice.s3.ap-south-1.amazonaws.com',
      'localhost',
      'ence.in'
    ]
  },
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: 'handlebars/dist/handlebars.js'
    }
    return config
  },
  transpilePackages: ['helper']
}

module.exports = nextConfig
