/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Note: App Router doesn't use api.bodyParser - limits are handled in route handlers
  // For Vercel deployments, body size limits are configured in vercel.json or project settings
}

module.exports = nextConfig

module.exports = nextConfig

module.exports = nextConfig