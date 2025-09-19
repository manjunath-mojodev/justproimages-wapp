"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Copy } from "lucide-react";
import { useQRCodeStore } from "@/store/qr-store";
import { QRCodeGenerator } from "@/lib/qr-generator";
import { QRCodeExporter } from "@/lib/export";
import { toast } from "sonner";

export function QRPreview() {
  const {
    config,
    qrCodeDataUrl,
    isLoading,
    setQRCodeData,
    setLoading,
    setError,
  } = useQRCodeStore();
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async () => {
    if (!config.content.trim()) {
      setError("Please enter content for the QR code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [dataUrl, svg] = await Promise.all([
        QRCodeGenerator.generateQRCode(config),
        QRCodeGenerator.generateQRCodeSVG(config),
      ]);

      setQRCodeData(dataUrl, svg);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate QR code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportPNG = async () => {
    if (!qrCodeDataUrl) return;

    try {
      await QRCodeExporter.exportAsPNG(
        qrCodeDataUrl,
        `qr-code-${Date.now()}.png`
      );
      toast.success("QR code exported as PNG");
    } catch (error) {
      toast.error("Failed to export PNG");
    }
  };

  const handleExportSVG = async () => {
    try {
      await QRCodeExporter.exportAsSVG(config, `qr-code-${Date.now()}.svg`);
      toast.success("QR code exported as SVG");
    } catch (error) {
      toast.error("Failed to export SVG");
    }
  };

  const handleExportPDF = async () => {
    if (!qrCodeDataUrl) return;

    try {
      await QRCodeExporter.exportAsPDF(
        qrCodeDataUrl,
        `qr-code-${Date.now()}.pdf`
      );
      toast.success("QR code exported as PDF");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  const handleCopyToClipboard = async () => {
    if (!qrCodeDataUrl) return;

    try {
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("QR code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Auto-generate QR code when config changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (config.content.trim()) {
        generateQRCode();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [config]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold">QR Code Preview</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateQRCode}
                disabled={isLoading || !config.content.trim()}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Regenerate
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div
              ref={qrRef}
              className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-200"
              style={{ minHeight: "200px", minWidth: "200px" }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Generating QR code...
                  </p>
                </div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Generated QR Code"
                  className="max-w-full max-h-full"
                  style={{
                    width: `${config.size}px`,
                    height: `${config.size}px`,
                  }}
                />
              ) : (
                <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                  <div className="w-16 h-16 border-2 border-dashed border-current rounded" />
                  <p className="text-sm">Enter content to generate QR code</p>
                </div>
              )}
            </div>

            {qrCodeDataUrl && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPNG}>
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportSVG}>
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
