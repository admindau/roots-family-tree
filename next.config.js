/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true }, // avoids image-optimizer/broken image issues
}
module.exports = nextConfig
