/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ik.imagekit.io'],
    loader: 'custom',
    loaderFile: './src/lib/imagekit-loader.js',
  },
  // Enable experimental features if needed
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig