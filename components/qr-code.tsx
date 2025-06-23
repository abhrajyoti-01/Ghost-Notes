"use client"

import { useEffect, useRef, memo } from "react"
import QRCode from "qrcode"

interface QRCodeComponentProps {
  value: string
  size?: number
}

// Memoized QR code component to prevent unnecessary re-renders
const QRCodeComponent = memo(function QRCodeComponent({ value, size = 200 }: QRCodeComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && value) {
      // Use requestAnimationFrame for better performance
      const generateQR = () => {
        QRCode.toCanvas(canvasRef.current!, value, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "M", // Optimize for size vs error correction
        }).catch(console.error)
      }

      requestAnimationFrame(generateQR)
    }
  }, [value, size])

  return <canvas ref={canvasRef} id="qr-code" className="max-w-full h-auto" />
})

export default QRCodeComponent
