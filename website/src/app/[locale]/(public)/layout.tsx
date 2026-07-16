import { logo } from "@/assets"
import Header from "@/components/common/header"
import { LOCALES } from "@/config"
import { siteConfig } from "@/config/site"
import { Metadata } from "next"

type Props = {
  params: Promise<{ locale: (typeof LOCALES)[number] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const locale = (await params).locale

  const data = siteConfig["share"][locale]

  return {
    ...data,
    openGraph: { images: [logo.src] },
  }
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />

      {children}
    </div>
  )
}
