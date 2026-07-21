const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin(
  // Specify a custom path here
  "./src/lib/i18n/index.ts",
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL("https://api.aman.76.13.250.92.nip.io/**")
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://drive.google.com https://docs.google.com;",
          },
        ],
      },
    ]
  },
  allowedDevOrigins: ["10.0.0.3"],
}

module.exports = withNextIntl(nextConfig)
