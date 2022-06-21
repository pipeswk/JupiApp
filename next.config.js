/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "media3.giphy.com"
    ]
  }
}

module.exports = nextConfig
