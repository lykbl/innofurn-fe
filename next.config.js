/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  reactStrictMode: true, // TODO toggle me back
  sassOptions: {
    // includePaths: [path.join(__dirname, 'path', 'styles')],
  },
};

module.exports = nextConfig;
