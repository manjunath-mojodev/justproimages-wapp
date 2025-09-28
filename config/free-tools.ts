export interface FreeTool {
  id: string;
  name: string;
  href: string;
  description?: string;
  icon?: string;
  comingSoon?: boolean;
}

export const freeTools: FreeTool[] = [
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    href: "/free-tools/qr-code-generator",
    description:
      "Create custom QR codes for URLs, text, WiFi, vCards, and more",
    icon: "QrCode",
  },
  {
    id: "bulk-create",
    name: "Bulk Create",
    href: "/free-tools/bulk-create",
    description: "Create multiple QR codes at once",
    icon: "Layers",
    comingSoon: false,
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    href: "/free-tools/image-resizer",
    description: "Resize and optimize images for different platforms",
    icon: "Image",
    comingSoon: true,
  },
  {
    id: "color-picker",
    name: "Color Picker",
    href: "/free-tools/color-picker",
    description: "Extract colors from images and generate palettes",
    icon: "Palette",
    comingSoon: true,
  },
  {
    id: "text-to-image",
    name: "Text to Image",
    href: "/free-tools/text-to-image",
    description: "Generate images from text descriptions using AI",
    icon: "Type",
    comingSoon: true,
  },
];

export const getActiveTools = () =>
  freeTools.filter((tool) => !tool.comingSoon);
export const getComingSoonTools = () =>
  freeTools.filter((tool) => tool.comingSoon);
