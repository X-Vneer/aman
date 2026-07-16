/* eslint-disable react-refresh/only-export-components */
import React from "react"
import ActiveFiltersBar from "@/components/common/active-filters-bar"
import { useReportsActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { LineChart } from "@mantine/charts"
import { Alert, Box, Button, Divider, Group, Paper, Stack, Text } from "@mantine/core"
import { useSuspenseQueries } from "@tanstack/react-query"
import { CloudDownload, TriangleAlert } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import Filters from "./components/filters"
import LineBarGraph from "./components/line-bar-graph"
import { GetCertificates } from "./get-certificates"
import { GetGeneralReports } from "./get-reports"
import { GetUsers } from "./get-users"

const GraphType = ["hourly", "daily", "weekly", "monthly", "yearly", "custom"] as const

export const generateSearchParams = (old: URLSearchParams, omit: string[]) => {
  const n = new URLSearchParams(old)
  omit.forEach((v) => n.delete(v))
  return n
}

const Reports = () => {
  const { t } = useTranslation()
  const activeFilterChips = useReportsActiveFilterChips()
  const targetRef = React.useRef<HTMLDivElement>(null)

  const toPDF = React.useCallback(async () => {
    if (!targetRef.current) return

    try {
      // Wait for fonts to load
      await document.fonts.ready

      // Convert to image using html-to-image (handles oklch colors better than html2canvas)
      const dataUrl = await toPng(targetRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipAutoScale: false,
        skipFonts: false,
        filter: (node) =>
          !(node instanceof HTMLElement && node.dataset.exportHide === "true"),
      })

      // Create an image element to get dimensions
      const img = new Image()
      img.src = dataUrl
      
      await new Promise((resolve) => {
        img.onload = resolve
      })
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (img.height * imgWidth) / img.width
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save("report.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }, [])

  const searchParams = useOptimisticSearchParams()
  const newSearchParams = generateSearchParams(searchParams, ["dates"])

  const queries = useSuspenseQueries({
    queries: [
      {
        queryKey: ["reports", "general", "graph", newSearchParams.toString()],
        queryFn: () => GetGeneralReports(newSearchParams),
      },
      {
        queryKey: ["reports", "certificates", "graph", newSearchParams.toString()],
        queryFn: () => GetCertificates(newSearchParams),
      },
      {
        queryKey: ["reports", "users", "graph", newSearchParams.toString()],
        queryFn: () => GetUsers(newSearchParams),
      },
    ],
  })

  const generalGraph = queries[0]
  const certificateGraph = queries[1]
  const userGraph = queries[2]

  const [langs, setLangs] = useQueryState("langs[]", parseAsArrayOf(parseAsString).withDefault([]))
  const [coupon] = useQueryState("coupon", parseAsString.withDefault(""))
  const [showCertificatesNotice, setShowCertificatesNotice] = React.useState(true)
  const [showUsersNotice, setShowUsersNotice] = React.useState(true)
  const allSeries = [
    { name: "y_ar", label: t("langs.ar"), color: "#18BDBE" },
    { name: "y_en", label: t("langs.en"), color: "#F16238" },
    { name: "y_ur", label: t("langs.ur"), color: "#9156E6" },
    { name: "y_fr", label: t("langs.fr"), color: "#3E4142" },
    { name: "y_fil", label: t("langs.fil"), color: "#4642E7" },
    { name: "y_id", label: t("langs.id"), color: "yellow.5" },
  ]
  const series = langs.length >= 1 ? allSeries.filter((s) => langs.includes(s.name.split("_")[1])) : allSeries
  // group type
  const range = [searchParams.get("date_from") ?? "", searchParams.get("date_to") ?? ""]
  const type = range.includes("")
    ? ((searchParams.get("dates") as (typeof GraphType)[number]) ?? "daily")
    : "custom"

  // handle export

  const sm = useSmallScreen()

  return (
    <Stack ref={targetRef} gap={"lg"}>
      <Group justify="flex-end">
        <Filters />

        <Button
          variant="white"
          className="!border !border-gray-300"
          color="#5A5A5A"
          size="sm"
          leftSection={sm ? null : <CloudDownload size={22} />}
          onClick={() => toPDF()}>
          {sm ? <CloudDownload size={22} /> : t("global.export")}
        </Button>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />

      <Paper component={Stack} gap={"lg"} p="lg" radius="md">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            {t("reports.general.title")}
          </Text>
        </Group>
        <Divider color="gray.1" />
        <Box p="md" id="reports-chart">
          <LineChart
            h={300}
            data={generalGraph["data"][type] || []}
            dataKey={"x"}
            withLegend
            yAxisLabel={t("reports.general.y-axis-label")}
            series={series}
            curveType="monotone"
          />
        </Box>
      </Paper>

      {coupon && showCertificatesNotice ? (
        <Alert
          color="yellow"
          variant="light"
          icon={<TriangleAlert size={18} />}
          withCloseButton
          onClose={() => setShowCertificatesNotice(false)}
          data-export-hide="true"
          className="print:hidden">
          {t("reports.coupon-filter-notice.certificates")}
        </Alert>
      ) : null}
      <LineBarGraph
        title={t("reports.certificate-count.title")}
        title_label={t("global.total-certificates-count")}
        data={certificateGraph.data}
      />
      {coupon && showUsersNotice ? (
        <Alert
          color="yellow"
          variant="light"
          icon={<TriangleAlert size={18} />}
          withCloseButton
          onClose={() => setShowUsersNotice(false)}
          data-export-hide="true"
          className="print:hidden">
          {t("reports.coupon-filter-notice.users")}
        </Alert>
      ) : null}
      <LineBarGraph
        key={"user-graph"}
        title={t("reports.users-count.title")}
        title_label={t("global.total-users-count")}
        data={userGraph.data}
      />
    </Stack>
  )
}

export default Reports
