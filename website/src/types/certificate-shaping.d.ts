declare module "arabic-reshaper" {
  export function convertArabic(input: string): string
  export function convertArabicBack(input: string): string
}

declare module "bidi-js" {
  interface BidiApi {
    getEmbeddingLevels(text: string, baseDirection?: "ltr" | "rtl" | "auto"): unknown
    getReorderedString(text: string, embeddingLevels: unknown): string
  }
  export default function bidiFactory(): BidiApi
}
