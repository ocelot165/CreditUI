/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false, // Recommended for the `pages` directory, default in `app`.

  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
