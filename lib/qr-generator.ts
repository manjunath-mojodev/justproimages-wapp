import QRCode from "qrcode";
import {
  QRCodeConfig,
  QRCodeType,
  WiFiConfig,
  VCardConfig,
  SMSConfig,
  EmailConfig,
  CalendarConfig,
} from "@/types/qr";

export class QRCodeGenerator {
  static async generateQRCode(config: QRCodeConfig): Promise<string> {
    const content = this.buildContent(config);

    const options = {
      width: config.size,
      margin: config.margin,
      color: {
        dark: config.foregroundColor,
        light: config.backgroundColor,
      },
      errorCorrectionLevel: config.errorCorrectionLevel,
    };

    try {
      return await QRCode.toDataURL(content, options);
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  static async generateQRCodeSVG(config: QRCodeConfig): Promise<string> {
    const content = this.buildContent(config);

    const options = {
      width: config.size,
      margin: config.margin,
      color: {
        dark: config.foregroundColor,
        light: config.backgroundColor,
      },
      errorCorrectionLevel: config.errorCorrectionLevel,
    };

    try {
      return await QRCode.toString(content, { type: "svg", ...options });
    } catch (error) {
      throw new Error(`Failed to generate QR code SVG: ${error}`);
    }
  }

  private static buildContent(config: QRCodeConfig): string {
    switch (config.type) {
      case "url":
        return this.buildUrlContent(config.content);
      case "text":
        return config.content;
      case "wifi":
        return this.buildWiFiContent(JSON.parse(config.content) as WiFiConfig);
      case "vcard":
        return this.buildVCardContent(
          JSON.parse(config.content) as VCardConfig
        );
      case "sms":
        return this.buildSMSContent(JSON.parse(config.content) as SMSConfig);
      case "email":
        return this.buildEmailContent(
          JSON.parse(config.content) as EmailConfig
        );
      case "phone":
        return this.buildPhoneContent(config.content);
      case "calendar":
        return this.buildCalendarContent(
          JSON.parse(config.content) as CalendarConfig
        );
      default:
        return config.content;
    }
  }

  private static buildUrlContent(url: string): string {
    // Ensure URL has protocol
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  }

  private static buildWiFiContent(config: WiFiConfig): string {
    const security = config.security === "nopass" ? "" : `T:${config.security}`;
    const hidden = config.hidden ? "H:true" : "";
    const password = config.password ? `P:${config.password}` : "";

    const parts = [
      "WIFI:",
      `S:${config.ssid}`,
      security,
      password,
      hidden,
    ].filter(Boolean);

    return parts.join(";");
  }

  private static buildVCardContent(config: VCardConfig): string {
    const parts = ["BEGIN:VCARD", "VERSION:3.0"];

    if (config.firstName || config.lastName) {
      parts.push(`FN:${config.firstName} ${config.lastName}`.trim());
      parts.push(`N:${config.lastName};${config.firstName};;;`);
    }

    if (config.organization) parts.push(`ORG:${config.organization}`);
    if (config.title) parts.push(`TITLE:${config.title}`);
    if (config.phone) parts.push(`TEL:${config.phone}`);
    if (config.email) parts.push(`EMAIL:${config.email}`);
    if (config.website) parts.push(`URL:${config.website}`);

    if (
      config.address ||
      config.city ||
      config.state ||
      config.zip ||
      config.country
    ) {
      const address = [
        config.address,
        config.city,
        config.state,
        config.zip,
        config.country,
      ]
        .filter(Boolean)
        .join(", ");
      parts.push(`ADR:;;${address};;;`);
    }

    parts.push("END:VCARD");
    return parts.join("\n");
  }

  private static buildSMSContent(config: SMSConfig): string {
    const message = config.message ? `:${config.message}` : "";
    return `sms:${config.phone}${message}`;
  }

  private static buildEmailContent(config: EmailConfig): string {
    const params = [];
    if (config.subject)
      params.push(`subject=${encodeURIComponent(config.subject)}`);
    if (config.body) params.push(`body=${encodeURIComponent(config.body)}`);

    const queryString = params.length > 0 ? `?${params.join("&")}` : "";
    return `mailto:${config.email}${queryString}`;
  }

  private static buildPhoneContent(phone: string): string {
    return `tel:${phone}`;
  }

  private static buildCalendarContent(config: CalendarConfig): string {
    const formatDate = (date: string, allDay: boolean) => {
      if (allDay) {
        return date.replace(/[-:]/g, "").split("T")[0];
      }
      return date.replace(/[-:]/g, "").replace("T", "T").replace(/\..*$/, "Z");
    };

    const parts = [
      "BEGIN:VEVENT",
      `SUMMARY:${config.title}`,
      `DTSTART:${formatDate(config.startDate, config.allDay || false)}`,
      `DTEND:${formatDate(config.endDate, config.allDay || false)}`,
    ];

    if (config.description) parts.push(`DESCRIPTION:${config.description}`);
    if (config.location) parts.push(`LOCATION:${config.location}`);

    parts.push("END:VEVENT");
    return parts.join("\n");
  }
}
