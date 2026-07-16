"use client"

import { Modal, useOverlayState } from "@heroui/react"
import { CircleX, Edit } from "lucide-react"
import { useTranslations } from "next-intl"
import { Story } from "../types"

export default function StoreModal({ id, title, first_name, last_name, age, content }: Story) {
  const t = useTranslations("global")
  const state = useOverlayState()

  return (
    <>
      <button
        type="button"
        onClick={state.open}
        className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
        {t("viewMore")}
      </button>
      <Modal.Backdrop
        isOpen={state.isOpen}
        className="bg-[#1A1919]/80"
        onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="max-w-3xl rounded-sm border-0 bg-[#141313]">
            {({ close }) => (
              <div className="relative overflow-hidden p-1">
                <div className="absolute -bottom-6 -right-6 opacity-10">
                  <Edit className="size-40 text-gray-500" strokeWidth={0.3} />
                </div>
                <div className="mb-3 rounded-t-lg bg-[#1D1B1B] px-4 py-4 md:px-6 md:py-5 lg:px-9 lg:py-7">
                  <h2 className="text-sm font-semibold md:text-base lg:text-xl">{title}</h2>
                </div>
                <div className="px-6 py-5 md:px-10 md:py-6 lg:px-16 lg:py-7">
                  <button
                    type="button"
                    onClick={close}
                    className="absolute top-6 z-10 flex items-center justify-center ltr:right-6 rtl:left-6">
                    <CircleX className="size-7" />
                  </button>

                  <div className="space-y-3 pb-4 text-white md:space-y-4 md:pb-5 lg:space-y-5 lg:pb-6">
                    <div className="text-white">
                      {first_name} {last_name}, {age}
                    </div>

                    <p className="text-sm leading-relaxed text-white">{content}</p>
                  </div>
                </div>
              </div>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}
