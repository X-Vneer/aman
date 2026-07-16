import { User } from "@/app/[locale]/(public)/profile/types"
import { LOCALES } from "@/config"
import { usePathname, useRouter } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { ErrorResponse, SuccessResponse } from "@/types"
import { Modal, Tabs } from "@heroui/react"
import { Ripple } from "m3-ripple"
import axios from "axios"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useState } from "react"
import Button from "../ui/button"

type Props = {}

const ChangeLanguage = (props: Props) => {
  const t = useTranslations("profile.dropdown.change-language")
  const { locale } = useParams()
  const [language, setLanguage] = useState<string>(locale as string)

  const [isOpen, seChangeLang] = useQueryState("change_lang", parseAsBoolean.withDefault(false))

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const Router = useRouter()
  const pathname = usePathname()

  const onUpdateLanguage = async () => {
    try {
      setError("")
      setIsLoading(true)
      const response = await AmanApi.patch<SuccessResponse<User>>(`/user/users/set-lang`, {
        lang: language,
      })
      Router.push({ pathname }, { locale: language })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        console.log("🚀 ~ onUpdateLanguage ~ error:", error)
        const responseError = error.response.data as ErrorResponse<{}>
        setError(responseError.message)
        return
      }
    } finally {
      setIsLoading(false)
    }
  }

  const title = {
    ar: "تغير اللغة",
    en: "Change the language",
    fr: "Modifier la langue",
    id: "Ubah bahasa",
  } as const

  const button = {
    ar: "تعديل اللغة",
    en: "Modify the language",
    fr: "Modifier la langue",
    id: "Ubah bahasa",
  } as const

  return (
    <Modal>
      <Modal.Backdrop isDismissable={true} isOpen={isOpen} onOpenChange={(open) => void seChangeLang(open)}>
        <Modal.Container>
          <Modal.Dialog className="bg-default-50 max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Body>
              <div className="py-6 md:py-8 lg:py-10">
                <h4 className="text-center text-lg text-white">{title[language as "ar"]}</h4>
                <div className="mx-auto my-6 h-px w-1/2 bg-white/25" />

                <div className="flex justify-center">
                  <Tabs
                    className="gap-0.5"
                    selectedKey={language}
                    variant="secondary"
                    onSelectionChange={(key) => setLanguage(String(key))}>
                    <Tabs.ListContainer>
                      <Tabs.List aria-label="Tabs variants" className="border-b border-transparent">
                        {LOCALES.map((element) => (
                          <Tabs.Tab
                            key={element}
                            className="selected:text-primary cursor-pointer px-1 text-xs md:px-2 md:text-base"
                            id={element}>
                            <Ripple />
                            {t(`tabs.${element}`)}
                            <Tabs.Indicator />
                          </Tabs.Tab>
                        ))}
                      </Tabs.List>
                    </Tabs.ListContainer>
                    {LOCALES.map((element) => (
                      <Tabs.Panel key={element} className="sr-only" id={element}>
                        {element}
                      </Tabs.Panel>
                    ))}
                  </Tabs>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="w-full">
                <Button size="md" isLoading={isLoading} onClick={onUpdateLanguage}>
                  {button[language as "ar"]}
                </Button>
                {error ? <p className="text-danger mt-3 text-sm font-semibold">{error}</p> : null}
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

export default ChangeLanguage
