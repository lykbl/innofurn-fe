/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  reactStrictMode: true, // TODO toggle me back
  sassOptions: {
    // includePaths: [path.join(__dirname, 'path', 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'innofurn-products.s3.eu-west-1.amazonaws.com',
        // port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
