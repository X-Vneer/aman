import { NextRequest, NextResponse } from "next/server"

import path from "node:path"
import { createCanvas, loadImage, registerFont } from "canvas"
import QRCode from "qrcode"
import { z } from "zod"

import { drawRoundedRectangle, formatDateToDDMMYYYY, searchParamsToObject, shapeText } from "./utils"
import { SITE_URL } from "@/config"

// Register the brand font (Latin + Arabic) once, from a runtime-stable path.
const fontFile = (name: string) => path.join(process.cwd(), "public", "fonts", name)
try {
  registerFont(fontFile("IBMPlexSansArabic-Bold.ttf"), { family: "IBMPlexSansArabicBold" })
  registerFont(fontFile("IBMPlexSansArabic-SemiBold.ttf"), { family: "IBMPlexSansArabicSemiBold" })
  registerFont(fontFile("IBMPlexSansArabic-Regular.ttf"), { family: "IBMPlexSansArabicRegular" })
} catch {
  // registerFont throws if called after a canvas context is created in the same
  // process; fonts already registered are fine to reuse.
}

const TEAL = "#1ad0d1"
const GREY = "#3F4142"

const searchParamsSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1),
  program_name: z.string().min(1),
  certificate_code: z.string().min(1),
  certificate_no: z.string().optional(),
  template_url: z.string().url().optional(),
  scale: z.coerce.number().optional(),
})

/** Word-wrap `text` to at most `maxLines` lines that each fit `maxWidth`. */
const wrapLines = (
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  text: string,
  maxWidth: number,
  maxLines = 2,
): string[] => {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  if (lines.length <= maxLines) return lines
  // Collapse overflow into the last allowed line.
  return [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(" ")]
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { success, error, data } = searchParamsSchema.safeParse(
    searchParamsToObject(request.nextUrl.searchParams),
  )
  if (!success) return NextResponse.json(error, { status: 422 })

  const { name, date, program_name, certificate_code, template_url } = data
  const scale = data.scale ?? 1
  await params // route param (video id) is not used for template selection anymore

  const defaultTemplate = path.join(process.cwd(), "public", "certificate.jpeg")

  try {
    const template = await loadImage(template_url ?? defaultTemplate).catch(() =>
      loadImage(defaultTemplate),
    )

    const W = template.width * scale
    const H = template.height * scale
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(template, 0, 0, W, H)
    ctx.textAlign = "center"

    // 1) User name — teal, bold.
    ctx.fillStyle = TEAL
    ctx.font = `${70 * scale}px IBMPlexSansArabicBold`
    ctx.fillText(shapeText(name), W / 2, H * 0.41)

    // 2) Program name — teal, semibold, wrapped to <= 2 lines.
    ctx.fillStyle = TEAL
    ctx.font = `${40 * scale}px IBMPlexSansArabicSemiBold`
    const programLines = wrapLines(ctx, shapeText(program_name), W * 0.82, 2)
    const programBaseline = H * 0.525
    const lineHeight = 52 * scale
    // Bottom-anchor the block just above the "Through the Aman…" template line.
    const startY = programBaseline - (programLines.length - 1) * lineHeight
    programLines.forEach((line, i) => ctx.fillText(line, W / 2, startY + i * lineHeight))

    // 3) Date — grey.
    ctx.fillStyle = GREY
    ctx.font = `${40 * scale}px IBMPlexSansArabicRegular`
    ctx.fillText(formatDateToDDMMYYYY(new Date(date)), W / 2, H * 0.61)

    // 4) QR code — centered below the date.
    const qrDataUrl = await QRCode.toDataURL(`${SITE_URL}/en/information-center/${certificate_code}`, {
      margin: 0.5,
      errorCorrectionLevel: "M",
    })
    const qrImage = await loadImage(qrDataUrl)
    const qrSize = W * 0.135
    const qrX = W / 2 - qrSize / 2
    const qrY = H * 0.645
    const radius = 24 * scale

    ctx.save()
    // @ts-ignore — drawRoundedRectangle takes the node-canvas 2d context
    drawRoundedRectangle(ctx, qrX, qrY, qrSize, qrSize, radius)
    ctx.clip()
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
    ctx.restore()

    const stream = canvas.createPNGStream()
    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk))
        stream.on("end", () => controller.close())
        stream.on("error", (err) => controller.error(err))
      },
    })

    return new Response(readable, { headers: { "Content-Type": "image/png" } })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error: " + err }, { status: 500 })
  }
}
