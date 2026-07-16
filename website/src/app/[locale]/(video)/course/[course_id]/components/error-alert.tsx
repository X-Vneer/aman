"use client"
import Button from "@/components/ui/button"
import { Modal } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"

type ErrorAlertProps = {
  isOpen: boolean
  errorMessage: string
  onClose: () => void
}

const ErrorAlert = ({ isOpen, errorMessage, onClose }: ErrorAlertProps) => {
  const t = useTranslations("course.error-alert")

  const handleOk = () => {
    onClose()
    window.location.reload()
  }

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled
      className="bg-[#0a090970] backdrop-blur-2xl"
      onOpenChange={(open) => {
        if (!open) onClose()
      }}>
      <Modal.Container>
        <Modal.Dialog className="max-w-lg overflow-hidden rounded-xl px-2 py-5 shadow-none duration-300 md:px-3 md:py-6 lg:px-4 lg:py-9">
          <AnimatePresence mode="wait">
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}>
              <Modal.Body className="space-y-6 p-0 shadow-none lg:space-y-8">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}>
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-20"></div>
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_10px_85px_2px_hsl(0deg_100%_50%)]">
                        <svg
                          className="h-10 w-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}>
                    <h3 className="text-2xl font-bold text-red-500">{t("title")}</h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full">
                    <div className="rounded-lg bg-[#292929] p-4 md:p-6 lg:p-8">
                      <p className="text-white md:text-lg lg:text-xl">{t("default-message")}</p>
                      {errorMessage && (
                        <p className="text-default-400 mt-2 text-sm md:text-base">{errorMessage}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-sm">
                    <Button onClick={handleOk} className="bg-red-600 hover:bg-red-700">
                      {t("ok-button")}
                    </Button>
                  </motion.div>
                </div>
              </Modal.Body>
            </motion.div>
          </AnimatePresence>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

export default ErrorAlert
