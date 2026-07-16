import "@/styles/globals.css"
// Import file protection to prevent file writes in production
import "@/lib/security/file-protection"

import clsx from "clsx"
import { Metadata, Viewport } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { fontSans, urdu } from "@/config/fonts"
import NySessionProvider from "@/lib/auth/provider"
import { routing } from "@/lib/i18n/routing"

import { logo } from "@/assets"
import { JsonLd, organizationSchema } from "@/components/common/json-ld"
import ScreenIndicator from "@/components/common/screen-indecator"
import { LOCALES, SITE_URL } from "@/config"
import { siteConfig } from "@/config/site"
import ReactQueryProvider from "@/lib/react-query/react-query-provider"
import Script from "next/script"
import { Providers } from "./providers"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "black" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

// Get metadata base URL from environment or default to localhost for dev
function getMetadataBase(): string {
  return SITE_URL
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: (typeof LOCALES)[number] }>
}): Promise<Metadata> {
  try {
    // read route params
    const locale = (await params).locale

    const data =
      siteConfig["share"][locale as keyof typeof siteConfig.share] ||
      siteConfig["share"][routing.defaultLocale as keyof typeof siteConfig.share]

    return {
      metadataBase: new URL(getMetadataBase()),
      ...data,
      openGraph: { images: [logo.src] },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    // Return default metadata on error
    const defaultData = siteConfig["share"][routing.defaultLocale as keyof typeof siteConfig.share]
    return {
      metadataBase: new URL(getMetadataBase()),
      ...defaultData,
      openGraph: { images: [logo.src] },
    }
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  let messages
  try {
    messages = await getMessages()
  } catch (error) {
    console.error("Failed to load messages:", error)
    // Fallback to empty messages object to prevent crash
    messages = {}
  }
  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={["ar", "ur"].includes(locale) ? "rtl" : "ltr"}
      className="dark">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1408SP6ECN"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-1408SP6ECN');
          `}
        </Script>
        <JsonLd data={organizationSchema()} />
      </head>
      <NextIntlClientProvider messages={messages}>
        <NuqsAdapter>
          <NySessionProvider>
            <ReactQueryProvider>
              <body
                suppressHydrationWarning
                className={clsx(
                  "bg-background dark min-h-screen font-sans text-white antialiased",
                  locale === "ur" ? urdu.variable : fontSans.variable,
                )}>
                <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>{children}</Providers>
                <ScreenIndicator />
              </body>
            </ReactQueryProvider>
          </NySessionProvider>
        </NuqsAdapter>
      </NextIntlClientProvider>
    </html>
  )
}
