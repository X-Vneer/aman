// Since we have a root `not-found.tsx` page, a layout file
// is required, even if it's just passing children through.
import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import "m3-ripple/ripple.css"
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
