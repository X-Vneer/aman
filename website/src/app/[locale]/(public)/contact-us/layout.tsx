import Footer from "@/components/common/footer"
import { setRequestLocale } from "next-intl/server"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <main className="container mx-auto max-w-7xl grow px-6 pt-5 md:pt-8 lg:pt-10">{children}</main>
      <Footer />
    </>
  )
}
