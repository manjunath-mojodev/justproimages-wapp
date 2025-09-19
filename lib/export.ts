import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { QRCodeConfig } from "@/types/qr";

export class QRCodeExporter {
  static async exportAsPNG(
    dataUrl: string,
    filename: string = "qr-code.png"
  ): Promise<void> {
    try {
      // Convert data URL to blob and download
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      throw new Error(`Failed to export PNG: ${error}`);
    }
  }

  static async exportAsSVG(
    config: QRCodeConfig,
    filename: string = "qr-code.svg"
  ): Promise<void> {
    try {
      const { QRCodeGenerator } = await import("./qr-generator");
      const svgContent = await QRCodeGenerator.generateQRCodeSVG(config);

      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      saveAs(blob, filename);
    } catch (error) {
      throw new Error(`Failed to export SVG: ${error}`);
    }
  }

  static async exportAsPDF(
    dataUrl: string,
    filename: string = "qr-code.pdf"
  ): Promise<void> {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Get image dimensions from data URL
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = 100; // mm
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (img.height * imgWidth) / img.width;
      let heightLeft = imgHeight;

      let position = 10;

      pdf.addImage(dataUrl, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      throw new Error(`Failed to export PDF: ${error}`);
    }
  }

  static downloadDataURL(dataUrl: string, filename: string): void {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
