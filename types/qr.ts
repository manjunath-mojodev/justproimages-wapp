export type QRCodeType =
  | "url"
  | "text"
  | "vcard"
  | "wifi"
  | "sms"
  | "email"
  | "phone"
  | "calendar";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeConfig {
  type: QRCodeType;
  content: string;
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  logo?: string;
  logoSize?: number;
}

export interface WiFiConfig {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface SMSConfig {
  phone: string;
  message?: string;
}

export interface EmailConfig {
  email: string;
  subject?: string;
  body?: string;
}

export interface CalendarConfig {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
}
