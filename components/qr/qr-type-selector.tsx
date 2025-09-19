"use client";

import { QRCodeType } from "@/types/qr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQRCodeStore } from "@/store/qr-store";
import {
  Globe,
  FileText,
  User,
  Wifi,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

const qrTypes: {
  value: QRCodeType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    value: "url",
    label: "Website URL",
    icon: Globe,
    description: "Link to a website or web page",
  },
  {
    value: "text",
    label: "Plain Text",
    icon: FileText,
    description: "Any text message or information",
  },
  {
    value: "vcard",
    label: "Contact Card",
    icon: User,
    description: "Share contact information (vCard)",
  },
  {
    value: "wifi",
    label: "WiFi Network",
    icon: Wifi,
    description: "Share WiFi network credentials",
  },
  {
    value: "sms",
    label: "SMS Message",
    icon: MessageSquare,
    description: "Send a text message",
  },
  {
    value: "email",
    label: "Email",
    icon: Mail,
    description: "Send an email message",
  },
  {
    value: "phone",
    label: "Phone Number",
    icon: Phone,
    description: "Make a phone call",
  },
  {
    value: "calendar",
    label: "Calendar Event",
    icon: Calendar,
    description: "Add to calendar",
  },
];

export function QRTypeSelector() {
  const { config, updateConfig } = useQRCodeStore();

  const handleTypeChange = (type: QRCodeType) => {
    // Reset content when changing type
    const defaultContent = getDefaultContent(type);
    updateConfig({ type, content: defaultContent });
  };

  const getDefaultContent = (type: QRCodeType): string => {
    switch (type) {
      case "url":
        return "https://example.com";
      case "text":
        return "Hello, World!";
      case "wifi":
        return JSON.stringify({
          ssid: "MyWiFi",
          password: "password123",
          security: "WPA",
          hidden: false,
        });
      case "vcard":
        return JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          organization: "Company Inc.",
          title: "Software Developer",
          phone: "+1234567890",
          email: "john@example.com",
        });
      case "sms":
        return JSON.stringify({
          phone: "+1234567890",
          message: "Hello!",
        });
      case "email":
        return JSON.stringify({
          email: "example@email.com",
          subject: "Hello",
          body: "Hello, how are you?",
        });
      case "phone":
        return "+1234567890";
      case "calendar":
        return JSON.stringify({
          title: "Meeting",
          description: "Team meeting",
          location: "Conference Room",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3600000).toISOString(),
          allDay: false,
        });
      default:
        return "";
    }
  };

  const selectedType = qrTypes.find((type) => type.value === config.type);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">QR Code Type</label>
      <Select value={config.type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedType && (
              <div className="flex items-center space-x-2">
                <selectedType.icon className="w-4 h-4" />
                <span>{selectedType.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {qrTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex items-center space-x-2">
                <type.icon className="w-4 h-4" />
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
