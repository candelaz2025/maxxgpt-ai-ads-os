const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: ['images.unsplash.com', 'graph.facebook.com'],
  },
};

module.exports = nextConfig;
