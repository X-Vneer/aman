import { Fira_Code as FontMono, Kufam as Urdu } from "next/font/google"
import localFont from "next/font/local"
export const fontSans = localFont({
  src: [
    {
      path: "../assets/fonts/IBMPlexSansArabic-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansArabic-Regular.ttf",
      weight: "400",
      style: "normal",
    },

    {
      path: "../assets/fonts/IBMPlexSansArabic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansArabic-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansArabic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
})
// export const urdu = localFont({
//   src: [
//     {
//       path: "../assets/fonts/NotoNastaliqUrdu-Regular.ttf",
//       weight: "400",
//       style: "normal",
//     },

//     {
//       path: "../assets/fonts/NotoNastaliqUrdu-Medium.ttf",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "../assets/fonts/NotoNastaliqUrdu-SemiBold.ttf",
//       weight: "600",
//       style: "normal",
//     },
//     {
//       path: "../assets/fonts/NotoNastaliqUrdu-Bold.ttf",
//       weight: "700",
//       style: "normal",
//     },
//   ],
//   variable: "--font-sans",
// })
export const urdu = Urdu({
  weight: ["400"],
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})
