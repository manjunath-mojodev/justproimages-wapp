import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { QRCodeConfig } from "@/types/qr";

export class QRCodeExporter {
  static async exportAsPNG(
    element: HTMLElement,
    filename: string = "qr-code.png"
  ): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, filename);
        }
      });
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
    element: HTMLElement,
    filename: string = "qr-code.pdf"
  ): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 100; // mm
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
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
