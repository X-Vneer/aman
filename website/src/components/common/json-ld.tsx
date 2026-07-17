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
    areaServed: "PS",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: "customer support",
      email: "",
      availableLanguage: ["ar", "en"],
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
}

const PAGE_CRUMB_LABEL: Record<PageMetaKey, Record<string, string>> = {
  home: HOME_LABEL,
  start: { ar: "البرامج", en: "Programs" },
  "about-us": { ar: "عن أمان", en: "About Us" },
  awareness: { ar: "التوعية", en: "Awareness" },
  blog: { ar: "المدونة", en: "Blog" },
  "contact-us": { ar: "تواصل معنا", en: "Contact Us" },
  faqs: { ar: "الأسئلة الشائعة", en: "FAQs" },
  "information-center": { ar: "مركز المعلومات", en: "Information Center" },
  "privacy-policy": { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  stories: { ar: "قصص الإنقاذ", en: "Stories" },
  terms: { ar: "الشروط والأحكام", en: "Terms" },
  login: { ar: "تسجيل الدخول", en: "Log in" },
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
  url: string
  locale: string
}

export function courseSchema(input: CourseSchemaInput) {
  const baseUrl = SITE_URL.replace(/\/$/, "")

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
    isAccessibleForFree: true,
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
