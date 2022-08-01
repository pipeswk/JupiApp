/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "media3.giphy.com",
      "media.giphy.com"
    ]
  }
}

module.exports = nextConfig
