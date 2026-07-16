import { SITE_URL } from "@/config"
import { getPageMeta, type PageMetaKey } from "@/config/page-meta"

type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue }

interface JsonLdProps {
  data: JsonLdValue
}

export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c")
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

export function organizationSchema() {
  const baseUrl = SITE_URL.replace(/\/$/, "")
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${baseUrl}#organization`,
    name: "Aman",
    alternateName: "منصة أمان",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    email: "",
    telephone: "",
    areaServed: "SA",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: "customer support",
      email: "",
      availableLanguage: ["ar", "en", "fr", "fil", "id", "ur"],
    },
  }
}

export interface BreadcrumbItem {
  name: string
  path: string
}

const HOME_LABEL: Record<string, string> = {
  ar: "الرئيسية",
  en: "Home",
  fr: "Accueil",
  fil: "Home",
  id: "Beranda",
  ur: "ہوم",
}

const PAGE_CRUMB_LABEL: Record<PageMetaKey, Record<string, string>> = {
  home: HOME_LABEL,
  start: { ar: "البرامج", en: "Programs", fr: "Programmes", fil: "Mga Programa", id: "Program", ur: "پروگرامز" },
  "about-us": { ar: "عن أمان", en: "About Us", fr: "À propos", fil: "Tungkol Sa Amin", id: "Tentang Kami", ur: "ہمارے بارے میں" },
  awareness: { ar: "التوعية", en: "Awareness", fr: "Sensibilisation", fil: "Kamalayan", id: "Kesadaran", ur: "آگاہی" },
  blog: { ar: "المدونة", en: "Blog", fr: "Blog", fil: "Blog", id: "Blog", ur: "بلاگ" },
  "contact-us": { ar: "تواصل معنا", en: "Contact Us", fr: "Contact", fil: "Makipag-ugnayan", id: "Kontak", ur: "رابطہ" },
  faqs: { ar: "الأسئلة الشائعة", en: "FAQs", fr: "FAQ", fil: "Mga FAQ", id: "FAQ", ur: "عام سوالات" },
  "information-center": { ar: "مركز المعلومات", en: "Information Center", fr: "Centre d'information", fil: "Information Center", id: "Pusat Informasi", ur: "معلوماتی مرکز" },
  "latest-news": { ar: "آخر الأخبار", en: "Latest News", fr: "Actualités", fil: "Pinakabagong Balita", id: "Berita Terbaru", ur: "تازہ ترین خبریں" },
  "privacy-policy": { ar: "سياسة الخصوصية", en: "Privacy Policy", fr: "Confidentialité", fil: "Privacy", id: "Privasi", ur: "رازداری" },
  stories: { ar: "قصص الإنقاذ", en: "Stories", fr: "Histoires", fil: "Mga Kwento", id: "Kisah", ur: "کہانیاں" },
  terms: { ar: "الشروط والأحكام", en: "Terms", fr: "Conditions", fil: "Mga Tuntunin", id: "Syarat", ur: "شرائط" },
  login: { ar: "تسجيل الدخول", en: "Log in", fr: "Se connecter", fil: "Mag-log in", id: "Masuk", ur: "لاگ ان" },
}

export function localizedCrumb(key: PageMetaKey, locale: string): string {
  return PAGE_CRUMB_LABEL[key][locale] ?? PAGE_CRUMB_LABEL[key].en ?? getPageMeta(key, locale).title
}

export function homeLabel(locale: string): string {
  return HOME_LABEL[locale] ?? HOME_LABEL.en
}

export function pageBreadcrumbSchema(key: PageMetaKey, locale: string, path: string) {
  return breadcrumbSchema(
    [
      { name: HOME_LABEL[locale] ?? HOME_LABEL.en, path: "" },
      { name: localizedCrumb(key, locale), path },
    ],
    locale,
  )
}

export function breadcrumbSchema(items: BreadcrumbItem[], locale: string) {
  const baseUrl = SITE_URL.replace(/\/$/, "")
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item:
        item.path === ""
          ? `${baseUrl}/${locale}`
          : `${baseUrl}/${locale}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  }
}

export interface CourseSchemaInput {
  id: string | number
  name: string
  description: string
  image?: string
  price?: string | null
  finalPrice?: string | null
  url: string
  locale: string
}

export function courseSchema(input: CourseSchemaInput) {
  const baseUrl = SITE_URL.replace(/\/$/, "")
  const price = input.finalPrice ?? input.price

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    inLanguage: input.locale,
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${baseUrl}#organization`,
      name: "Aman",
      url: baseUrl,
    },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "SAR",
            category: "Paid",
            url: input.url,
            availability: "https://schema.org/InStock",
          },
        }
      : { isAccessibleForFree: true }),
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: "PT1H",
        inLanguage: input.locale,
      },
    ],
  }
}
