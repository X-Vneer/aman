const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin(
  // Specify a custom path here
  "./src/lib/i18n/index.ts",
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://uat.api.inaash.edu.sa/**"), new URL("https://api.inaash.edu.sa/**")],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://www.googletagmanager.com https://drive.google.com https://docs.google.com;",
          },
        ],
      },
    ]
  },
  allowedDevOrigins: ["10.0.0.3"],
}

module.exports = withNextIntl(nextConfig)
