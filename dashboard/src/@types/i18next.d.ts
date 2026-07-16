import { resources } from "../lib/i18n"

declare module "i18next" {
  interface CustomTypeOptions {
    translation: "translation"
    resources: (typeof resources)["en"]
  }
}
