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
      {
        protocol: 'https',
        hostname: 'fakeimg.pl',
        // port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
