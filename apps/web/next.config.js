/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ence-invoice.s3.amazonaws.com']
  },
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: 'handlebars/dist/handlebars.js'
    }
    return config
  },
  transpilePackages: ['helper'],
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium']
  }
}

module.exports = nextConfig
