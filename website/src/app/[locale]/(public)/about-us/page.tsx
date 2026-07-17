import { logo } from "@/assets"
import { arShare, enShare } from "@/assets/share-your-success"
import Footer from "@/components/common/footer"
import { LOCALES } from "@/config"
import { AmanApiGuest } from "@/services/aman"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import AdditionalPartners from "./components/additional-partners"
import Objectives from "./components/objectives"
import OurPartners from "./components/our-partners"
import Solutions from "./components/solutions"
import SplittedLogo from "./components/splitted-logo"
import WhyUs from "./components/why-us"
import { AdditionalPartnersResponse } from "./types"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export async function generateMetadata(props: {
  params: Promise<{ locale: (typeof LOCALES)[number] }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("about-us", locale, "/about-us")
}

const images = {
  ar: arShare,
  en: enShare,
} as const

export const dynamic = "force-dynamic"
export default async function Page({ params }: { params: Promise<{ locale: (typeof LOCALES)[number] }> }) {
  const t = await getTranslations("about-us")
  // Enable static rendering
  const locale = (await params).locale
  const imageSrc = images[locale]

  const additionalPartnersResponse = await AmanApiGuest.get<AdditionalPartnersResponse>("/partners", {
    params: {
      per_page: 100,
      page: 1,
    },
  })
  const additionalPartners = additionalPartnersResponse.data.data.items.data

  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("about-us", locale, "/about-us")} />
      <section className="bg-[#141313]">
        <div className="container mx-auto max-w-7xl grow px-6">
          <div className="flex w-full flex-col items-center justify-between gap-5 pt-6 pb-6 md:flex-row md:gap-10 md:px-10 md:pb-10 lg:px-14 lg:pb-16 xl:px-20">
            <div className="mx-auto w-full space-y-1 max-md:max-w-sm max-md:text-center md:w-1/2">
              <h1 className="text-foreground text-2xl font-medium">{t("hero.title")}</h1>
              <p className="text-default-500 text-sm">{t("hero.description")}</p>
            </div>
            <div className="w-full md:w-1/2">
              <Image src={logo} alt="aman" className="mx-auto block w-full max-w-[250px]" />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-7xl grow px-6 pt-5 md:pt-8 lg:pt-10">
        <section className="flex w-full flex-col items-center justify-between gap-5 pt-2 pb-6 md:flex-row md:gap-10 md:px-10 md:pt-4 md:pb-10 lg:px-14 lg:pt-6 lg:pb-16 xl:px-20">
          <div className="mx-auto w-full space-y-12 max-md:max-w-sm max-md:text-center md:w-1/2">
            <div className="space-y-1">
              <h2 className="text-foreground font-medium lg:text-2xl">{t("target.title")}</h2>
              <p className="text-default-500 text-sm">{t("target.description")}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-foreground font-medium lg:text-2xl">{t("target.main.title")}</h3>
              <p className="text-default-500 text-sm">{t("target.main.description")}</p>
              <p className="text-default-500 text-sm">{t("target.main.sub-description")}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mx-auto hidden w-fit md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="288"
                height="326"
                viewBox="0 0 288 326"
                fill="none">
                <g opacity="0.5">
                  <g clipPath="url(#clip0_255_3276)">
                    <rect width="140" height="326" rx="4" fill="#1AD0D1" />
                    <path
                      d="M207 284C207 354.692 149.692 412 79 412C8.30755 412 -49 354.692 -49 284C-49 213.308 8.30755 156 79 156C149.692 156 207 213.308 207 284ZM41.0939 284C41.0939 304.935 58.065 321.906 79 321.906C99.935 321.906 116.906 304.935 116.906 284C116.906 263.065 99.935 246.094 79 246.094C58.065 246.094 41.0939 263.065 41.0939 284Z"
                      fill="#6BD7D8"
                    />
                    <g filter="url(#filter0_d_255_3276)">
                      <rect x="48" y="40" width="44" height="44" rx="4" fill="#120A09" />
                    </g>
                  </g>
                </g>
                <g opacity="0.5">
                  <g clipPath="url(#clip1_255_3276)">
                    <rect x="148" width="140" height="326" rx="4" fill="#666666" />
                    <path
                      d="M247 259C247 329.692 189.692 387 119 387C48.3076 387 -9 329.692 -9 259C-9 188.308 48.3076 131 119 131C189.692 131 247 188.308 247 259ZM81.0939 259C81.0939 279.935 98.065 296.906 119 296.906C139.935 296.906 156.906 279.935 156.906 259C156.906 238.065 139.935 221.094 119 221.094C98.065 221.094 81.0939 238.065 81.0939 259Z"
                      fill="#555555"
                      fillOpacity="0.69"
                    />
                    <path
                      d="M444 259C444 329.692 386.692 387 316 387C245.308 387 188 329.692 188 259C188 188.308 245.308 131 316 131C386.692 131 444 188.308 444 259ZM278.094 259C278.094 279.935 295.065 296.906 316 296.906C336.935 296.906 353.906 279.935 353.906 259C353.906 238.065 336.935 221.094 316 221.094C295.065 221.094 278.094 238.065 278.094 259Z"
                      fill="#777171"
                      fillOpacity="0.5"
                    />
                    <g filter="url(#filter1_d_255_3276)">
                      <rect x="196" y="40" width="44" height="44" rx="4" fill="#120A09" />
                    </g>
                  </g>
                </g>
                <path
                  d="M214.484 62.9596H216.999L217.766 64.469C217.83 64.5968 217.922 64.6966 218.042 64.7685C218.161 64.8404 218.285 64.8763 218.413 64.8763H222.031C222.238 64.8763 222.41 64.8084 222.546 64.6727C222.681 64.5369 222.749 64.3652 222.749 64.1576V59.8451C222.749 59.6374 222.681 59.4657 222.546 59.3299C222.41 59.1942 222.238 59.1263 222.031 59.1263H219.874L219.108 57.6169C219.044 57.4891 218.952 57.3893 218.832 57.3174C218.712 57.2456 218.589 57.2096 218.461 57.2096H213.885C213.677 57.2096 213.505 57.2775 213.37 57.4133C213.234 57.549 213.166 57.7208 213.166 57.9284V67.1044C213.166 67.2801 213.234 67.4318 213.37 67.5596C213.505 67.6874 213.661 67.7513 213.837 67.7513C214.013 67.7513 214.164 67.6834 214.292 67.5477C214.42 67.4119 214.484 67.2562 214.484 67.0805V62.9596ZM218.844 63.5586L217.886 61.6419H214.484V58.5273H218.03L218.988 60.444H221.432V63.5586H218.844ZM216.999 71.5846C215.69 71.5846 214.452 71.3331 213.286 70.8299C212.12 70.3268 211.102 69.64 210.231 68.7695C209.361 67.899 208.674 66.8808 208.171 65.7148C207.668 64.5489 207.416 63.311 207.416 62.0013C207.416 60.6756 207.668 59.4298 208.171 58.2638C208.674 57.0978 209.361 56.0836 210.231 55.2211C211.102 54.3586 212.12 53.6758 213.286 53.1727C214.452 52.6695 215.69 52.418 216.999 52.418C218.325 52.418 219.571 52.6695 220.737 53.1727C221.903 53.6758 222.917 54.3586 223.78 55.2211C224.642 56.0836 225.325 57.0978 225.828 58.2638C226.331 59.4298 226.583 60.6756 226.583 62.0013C226.583 63.311 226.331 64.5489 225.828 65.7148C225.325 66.8808 224.642 67.899 223.78 68.7695C222.917 69.64 221.903 70.3268 220.737 70.8299C219.571 71.3331 218.325 71.5846 216.999 71.5846ZM216.999 70.1471C219.267 70.1471 221.192 69.3525 222.773 67.7633C224.355 66.174 225.145 64.2534 225.145 62.0013C225.145 59.7333 224.355 57.8086 222.773 56.2273C221.192 54.6461 219.267 53.8555 216.999 53.8555C214.747 53.8555 212.827 54.6461 211.237 56.2273C209.648 57.8086 208.854 59.7333 208.854 62.0013C208.854 64.2534 209.648 66.174 211.237 67.7633C212.827 69.3525 214.747 70.1471 216.999 70.1471Z"
                  fill="#1AD0D1"
                />
                <path
                  d="M68.9993 71.5846C67.6736 71.5846 66.4278 71.3331 65.2618 70.8299C64.0959 70.3268 63.0816 69.644 62.2191 68.7815C61.3566 67.919 60.6738 66.9048 60.1707 65.7388C59.6676 64.5728 59.416 63.327 59.416 62.0013C59.416 60.6756 59.6676 59.4298 60.1707 58.2638C60.6738 57.0978 61.3566 56.0836 62.2191 55.2211C63.0816 54.3586 64.0959 53.6758 65.2618 53.1727C66.4278 52.6695 67.6736 52.418 68.9993 52.418C70.3251 52.418 71.5709 52.6695 72.7368 53.1727C73.9028 53.6758 74.9171 54.3586 75.7796 55.2211C76.6421 56.0836 77.3249 57.0978 77.828 58.2638C78.3311 59.4298 78.5827 60.6756 78.5827 62.0013C78.5827 63.327 78.3311 64.5728 77.828 65.7388C77.3249 66.9048 76.6421 67.919 75.7796 68.7815C74.9171 69.644 73.9028 70.3268 72.7368 70.8299C71.5709 71.3331 70.3251 71.5846 68.9993 71.5846ZM68.9993 70.1471C70.0056 70.1471 70.952 69.9834 71.8384 69.656C72.7249 69.3286 73.5275 68.8614 74.2462 68.2544L72.5212 66.5534C72.0261 66.9208 71.483 67.2122 70.8921 67.4279C70.3011 67.6435 69.6702 67.7513 68.9993 67.7513C67.4021 67.7513 66.0445 67.1923 64.9264 66.0742C63.8084 64.9562 63.2493 63.5985 63.2493 62.0013C63.2493 60.4041 63.8084 59.0464 64.9264 57.9284C66.0445 56.8103 67.4021 56.2513 68.9993 56.2513C70.5966 56.2513 71.9542 56.8103 73.0723 57.9284C74.1903 59.0464 74.7493 60.4041 74.7493 62.0013C74.7493 62.6721 74.6415 63.3031 74.4259 63.894C74.2103 64.485 73.9188 65.0281 73.5514 65.5232L75.2525 67.2242C75.8434 66.5055 76.3066 65.7068 76.6421 64.8284C76.9775 63.9499 77.1452 63.0076 77.1452 62.0013C77.1452 59.7333 76.3546 57.8086 74.7733 56.2273C73.1921 54.6461 71.2674 53.8555 68.9993 53.8555C66.7313 53.8555 64.8066 54.6461 63.2254 56.2273C61.6441 57.8086 60.8535 59.7333 60.8535 62.0013C60.8535 64.2693 61.6441 66.194 63.2254 67.7753C64.8066 69.3565 66.7313 70.1471 68.9993 70.1471ZM68.9993 66.3138C69.4626 66.3138 69.9058 66.2459 70.329 66.1102C70.7523 65.9744 71.1396 65.7787 71.491 65.5232L69.7181 63.7742C69.6063 63.8221 69.4905 63.8581 69.3707 63.882C69.2509 63.906 69.1271 63.918 68.9993 63.918C68.4723 63.918 68.021 63.7303 67.6457 63.3549C67.2704 62.9796 67.0827 62.5284 67.0827 62.0013C67.0827 61.4742 67.2704 61.023 67.6457 60.6477C68.021 60.2723 68.4723 60.0846 68.9993 60.0846C69.5264 60.0846 69.9777 60.2723 70.353 60.6477C70.7283 61.023 70.916 61.4742 70.916 62.0013C70.916 62.1291 70.9001 62.2568 70.8681 62.3846C70.8361 62.5124 70.7962 62.6402 70.7483 62.768L72.5212 64.493C72.7768 64.1416 72.9725 63.7542 73.1082 63.331C73.244 62.9077 73.3118 62.4645 73.3118 62.0013C73.3118 60.8034 72.8926 59.7852 72.054 58.9466C71.2155 58.1081 70.1973 57.6888 68.9993 57.6888C67.8014 57.6888 66.7832 58.1081 65.9447 58.9466C65.1061 59.7852 64.6868 60.8034 64.6868 62.0013C64.6868 63.1992 65.1061 64.2174 65.9447 65.056C66.7832 65.8945 67.8014 66.3138 68.9993 66.3138Z"
                  fill="#1AD0D1"
                />
                <defs>
                  <filter
                    id="filter0_d_255_3276"
                    x="39"
                    y="27"
                    width="76"
                    height="76"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="7" dy="3" />
                    <feGaussianBlur stdDeviation="8" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.188235 0 0 0 0 0.67451 0 0 0 0 1 0 0 0 0.09 0"
                    />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_255_3276" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_255_3276"
                      result="shape"
                    />
                  </filter>
                  <filter
                    id="filter1_d_255_3276"
                    x="187"
                    y="27"
                    width="76"
                    height="76"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="7" dy="3" />
                    <feGaussianBlur stdDeviation="8" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.188235 0 0 0 0 0.67451 0 0 0 0 1 0 0 0 0.09 0"
                    />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_255_3276" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_255_3276"
                      result="shape"
                    />
                  </filter>
                  <clipPath id="clip0_255_3276">
                    <rect width="140" height="326" rx="4" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_255_3276">
                    <rect x="148" width="140" height="326" rx="4" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="mx-auto w-fit md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="258"
                height="131"
                viewBox="0 0 288 131"
                fill="none">
                <g opacity="0.5">
                  <g clipPath="url(#clip0_458_7701)">
                    <rect width="140" height="131" rx="4" fill="#1AD0D1" />
                    <path
                      d="M207 168C207 238.692 149.692 296 79 296C8.30755 296 -49 238.692 -49 168C-49 97.3076 8.30755 40 79 40C149.692 40 207 97.3076 207 168ZM41.0939 168C41.0939 188.935 58.065 205.906 79 205.906C99.935 205.906 116.906 188.935 116.906 168C116.906 147.065 99.935 130.094 79 130.094C58.065 130.094 41.0939 147.065 41.0939 168Z"
                      fill="#6BD7D8"
                    />
                    <g filter="url(#filter0_d_458_7701)">
                      <rect x="48" y="40" width="44" height="44" rx="4" fill="#120A09" />
                    </g>
                  </g>
                </g>
                <g opacity="0.5">
                  <g clipPath="url(#clip1_458_7701)">
                    <rect x="148" width="140" height="131" rx="4" fill="#666666" />
                    <path
                      d="M247 128C247 198.692 189.692 256 119 256C48.3076 256 -9 198.692 -9 128C-9 57.3076 48.3076 0 119 0C189.692 0 247 57.3076 247 128ZM81.0939 128C81.0939 148.935 98.065 165.906 119 165.906C139.935 165.906 156.906 148.935 156.906 128C156.906 107.065 139.935 90.0939 119 90.0939C98.065 90.0939 81.0939 107.065 81.0939 128Z"
                      fill="#555555"
                      fillOpacity="0.69"
                    />
                    <path
                      d="M444 128C444 198.692 386.692 256 316 256C245.308 256 188 198.692 188 128C188 57.3076 245.308 0 316 0C386.692 0 444 57.3076 444 128ZM278.094 128C278.094 148.935 295.065 165.906 316 165.906C336.935 165.906 353.906 148.935 353.906 128C353.906 107.065 336.935 90.0939 316 90.0939C295.065 90.0939 278.094 107.065 278.094 128Z"
                      fill="#777171"
                      fillOpacity="0.5"
                    />
                    <g filter="url(#filter1_d_458_7701)">
                      <rect x="196" y="40" width="44" height="44" rx="4" fill="#120A09" />
                    </g>
                  </g>
                </g>
                <path
                  d="M214.486 62.9577H217.001L217.768 64.4671C217.832 64.5949 217.924 64.6947 218.043 64.7665C218.163 64.8384 218.287 64.8743 218.415 64.8743H222.033C222.24 64.8743 222.412 64.8065 222.548 64.6707C222.683 64.535 222.751 64.3632 222.751 64.1556V59.8431C222.751 59.6355 222.683 59.4637 222.548 59.328C222.412 59.1922 222.24 59.1243 222.033 59.1243H219.876L219.11 57.615C219.046 57.4872 218.954 57.3874 218.834 57.3155C218.714 57.2436 218.591 57.2077 218.463 57.2077H213.887C213.679 57.2077 213.507 57.2756 213.372 57.4113C213.236 57.5471 213.168 57.7188 213.168 57.9264V67.1025C213.168 67.2782 213.236 67.4299 213.372 67.5577C213.507 67.6855 213.663 67.7493 213.839 67.7493C214.015 67.7493 214.166 67.6815 214.294 67.5457C214.422 67.41 214.486 67.2542 214.486 67.0785V62.9577ZM218.846 63.5566L217.888 61.64H214.486V58.5254H218.032L218.99 60.4421H221.434V63.5566H218.846ZM217.001 71.5827C215.692 71.5827 214.454 71.3311 213.288 70.828C212.122 70.3249 211.104 69.6381 210.233 68.7676C209.363 67.8971 208.676 66.8788 208.173 65.7129C207.67 64.5469 207.418 63.3091 207.418 61.9993C207.418 60.6736 207.67 59.4278 208.173 58.2618C208.676 57.0959 209.363 56.0816 210.233 55.2191C211.104 54.3566 212.122 53.6738 213.288 53.1707C214.454 52.6676 215.692 52.416 217.001 52.416C218.327 52.416 219.573 52.6676 220.739 53.1707C221.905 53.6738 222.919 54.3566 223.782 55.2191C224.644 56.0816 225.327 57.0959 225.83 58.2618C226.333 59.4278 226.585 60.6736 226.585 61.9993C226.585 63.3091 226.333 64.5469 225.83 65.7129C225.327 66.8788 224.644 67.8971 223.782 68.7676C222.919 69.6381 221.905 70.3249 220.739 70.828C219.573 71.3311 218.327 71.5827 217.001 71.5827ZM217.001 70.1452C219.269 70.1452 221.194 69.3506 222.775 67.7613C224.357 66.1721 225.147 64.2514 225.147 61.9993C225.147 59.7313 224.357 57.8066 222.775 56.2254C221.194 54.6441 219.269 53.8535 217.001 53.8535C214.749 53.8535 212.829 54.6441 211.239 56.2254C209.65 57.8066 208.855 59.7313 208.855 61.9993C208.855 64.2514 209.65 66.1721 211.239 67.7613C212.829 69.3506 214.749 70.1452 217.001 70.1452Z"
                  fill="#1AD0D1"
                />
                <path
                  d="M69.0013 71.5827C67.6756 71.5827 66.4298 71.3311 65.2638 70.828C64.0978 70.3249 63.0836 69.6421 62.2211 68.7796C61.3586 67.9171 60.6758 66.9028 60.1727 65.7368C59.6695 64.5709 59.418 63.3251 59.418 61.9993C59.418 60.6736 59.6695 59.4278 60.1727 58.2618C60.6758 57.0959 61.3586 56.0816 62.2211 55.2191C63.0836 54.3566 64.0978 53.6738 65.2638 53.1707C66.4298 52.6676 67.6756 52.416 69.0013 52.416C70.327 52.416 71.5728 52.6676 72.7388 53.1707C73.9048 53.6738 74.919 54.3566 75.7815 55.2191C76.644 56.0816 77.3268 57.0959 77.8299 58.2618C78.3331 59.4278 78.5846 60.6736 78.5846 61.9993C78.5846 63.3251 78.3331 64.5709 77.8299 65.7368C77.3268 66.9028 76.644 67.9171 75.7815 68.7796C74.919 69.6421 73.9048 70.3249 72.7388 70.828C71.5728 71.3311 70.327 71.5827 69.0013 71.5827ZM69.0013 70.1452C70.0076 70.1452 70.9539 69.9815 71.8404 69.654C72.7268 69.3266 73.5294 68.8594 74.2482 68.2525L72.5232 66.5514C72.0281 66.9188 71.485 67.2103 70.894 67.4259C70.3031 67.6415 69.6721 67.7493 69.0013 67.7493C67.4041 67.7493 66.0464 67.1903 64.9284 66.0723C63.8103 64.9542 63.2513 63.5966 63.2513 61.9993C63.2513 60.4021 63.8103 59.0445 64.9284 57.9264C66.0464 56.8084 67.4041 56.2493 69.0013 56.2493C70.5985 56.2493 71.9562 56.8084 73.0742 57.9264C74.1923 59.0445 74.7513 60.4021 74.7513 61.9993C74.7513 62.6702 74.6435 63.3011 74.4279 63.8921C74.2122 64.483 73.9208 65.0261 73.5534 65.5212L75.2544 67.2223C75.8454 66.5035 76.3086 65.7049 76.644 64.8264C76.9794 63.948 77.1471 63.0056 77.1471 61.9993C77.1471 59.7313 76.3565 57.8066 74.7753 56.2254C73.194 54.6441 71.2693 53.8535 69.0013 53.8535C66.7333 53.8535 64.8086 54.6441 63.2273 56.2254C61.6461 57.8066 60.8555 59.7313 60.8555 61.9993C60.8555 64.2674 61.6461 66.1921 63.2273 67.7733C64.8086 69.3546 66.7333 70.1452 69.0013 70.1452ZM69.0013 66.3118C69.4645 66.3118 69.9077 66.244 70.331 66.1082C70.7542 65.9725 71.1416 65.7768 71.493 65.5212L69.7201 63.7723C69.6083 63.8202 69.4924 63.8561 69.3727 63.8801C69.2529 63.904 69.1291 63.916 69.0013 63.916C68.4742 63.916 68.023 63.7283 67.6477 63.353C67.2723 62.9777 67.0846 62.5264 67.0846 61.9993C67.0846 61.4723 67.2723 61.021 67.6477 60.6457C68.023 60.2704 68.4742 60.0827 69.0013 60.0827C69.5284 60.0827 69.9796 60.2704 70.3549 60.6457C70.7303 61.021 70.918 61.4723 70.918 61.9993C70.918 62.1271 70.902 62.2549 70.8701 62.3827C70.8381 62.5105 70.7982 62.6382 70.7503 62.766L72.5232 64.491C72.7787 64.1396 72.9744 63.7523 73.1102 63.329C73.2459 62.9058 73.3138 62.4626 73.3138 61.9993C73.3138 60.8014 72.8945 59.7832 72.056 58.9447C71.2174 58.1061 70.1992 57.6868 69.0013 57.6868C67.8034 57.6868 66.7852 58.1061 65.9466 58.9447C65.1081 59.7832 64.6888 60.8014 64.6888 61.9993C64.6888 63.1973 65.1081 64.2155 65.9466 65.054C66.7852 65.8926 67.8034 66.3118 69.0013 66.3118Z"
                  fill="#1AD0D1"
                />
                <defs>
                  <filter
                    id="filter0_d_458_7701"
                    x="39"
                    y="27"
                    width="76"
                    height="76"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="7" dy="3" />
                    <feGaussianBlur stdDeviation="8" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.188235 0 0 0 0 0.67451 0 0 0 0 1 0 0 0 0.09 0"
                    />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_458_7701" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_458_7701"
                      result="shape"
                    />
                  </filter>
                  <filter
                    id="filter1_d_458_7701"
                    x="187"
                    y="27"
                    width="76"
                    height="76"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="7" dy="3" />
                    <feGaussianBlur stdDeviation="8" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.188235 0 0 0 0 0.67451 0 0 0 0 1 0 0 0 0.09 0"
                    />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_458_7701" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_458_7701"
                      result="shape"
                    />
                  </filter>
                  <clipPath id="clip0_458_7701">
                    <rect width="140" height="131" rx="4" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_458_7701">
                    <rect x="148" width="140" height="131" rx="4" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </section>
      </main>
      <Objectives />
      <section className="container mx-auto max-w-7xl grow px-6">
        <div className="flex w-full flex-col items-center justify-between gap-5 py-10 md:flex-row md:gap-10 md:px-10 md:py-16 lg:px-14 lg:py-24 xl:px-20 xl:py-28">
          <div className="w-full md:w-1/3">
            <Image src={imageSrc} className="rounded-lg" alt="share ur success" />
          </div>
          <div className="mx-auto w-full space-y-12 max-md:max-w-sm max-md:text-center md:w-2/3">
            <div className="space-y-3">
              <h2 className="text-foreground font-medium lg:text-2xl">{t("about-us.title")}</h2>
              <p className="text-default-500 text-sm">{t("about-us.description")}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-foreground font-medium lg:text-2xl">{t("about-us.updates.title")}</h3>
              <p className="text-default-500 text-sm">{t("about-us.updates.description")}</p>
            </div>
          </div>
        </div>
      </section>
      <Solutions />
      <WhyUs />
      <Footer />
    </>
  )
}
