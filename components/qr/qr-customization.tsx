"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useQRCodeStore } from "@/store/qr-store";
import { ErrorCorrectionLevel } from "@/types/qr";
import { Palette, Ruler, Shield, Square } from "lucide-react";

const errorCorrectionLevels: {
  value: ErrorCorrectionLevel;
  label: string;
  description: string;
}[] = [
  { value: "L", label: "Low (L)", description: "~7% error correction" },
  { value: "M", label: "Medium (M)", description: "~15% error correction" },
  { value: "Q", label: "Quartile (Q)", description: "~25% error correction" },
  { value: "H", label: "High (H)", description: "~30% error correction" },
];

const presetSizes = [
  { label: "Small", value: 128 },
  { label: "Medium", value: 256 },
  { label: "Large", value: 512 },
  { label: "Extra Large", value: 1024 },
];

const presetColors = [
  { name: "Black on White", foreground: "#000000", background: "#ffffff" },
  { name: "Blue on White", foreground: "#2563eb", background: "#ffffff" },
  { name: "Green on White", foreground: "#16a34a", background: "#ffffff" },
  { name: "Red on White", foreground: "#dc2626", background: "#ffffff" },
  { name: "Purple on White", foreground: "#9333ea", background: "#ffffff" },
  { name: "White on Black", foreground: "#ffffff", background: "#000000" },
  { name: "White on Blue", foreground: "#ffffff", background: "#2563eb" },
  { name: "White on Green", foreground: "#ffffff", background: "#16a34a" },
];

export function QRCustomization() {
  const { config, updateConfig } = useQRCodeStore();

  const handleSizeChange = (value: number[]) => {
    updateConfig({ size: value[0] });
  };

  const handleMarginChange = (value: number[]) => {
    updateConfig({ margin: value[0] });
  };

  const handleColorPreset = (foreground: string, background: string) => {
    updateConfig({ foregroundColor: foreground, backgroundColor: background });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Customization</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Size Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Ruler className="w-4 h-4" />
            <Label className="text-base font-medium">Size & Spacing</Label>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="size">QR Code Size: {config.size}px</Label>
              <Slider
                id="size"
                value={[config.size]}
                onValueChange={handleSizeChange}
                min={64}
                max={2048}
                step={8}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>64px</span>
                <span>2048px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {presetSizes.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => updateConfig({ size: preset.value })}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    config.size === preset.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="margin">Margin: {config.margin}</Label>
            <Slider
              id="margin"
              value={[config.margin]}
              onValueChange={handleMarginChange}
              min={0}
              max={20}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>20</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Color Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Square className="w-4 h-4" />
            <Label className="text-base font-medium">Colors</Label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="foreground">Foreground Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="foreground"
                    type="color"
                    value={config.foregroundColor}
                    onChange={(e) =>
                      updateConfig({ foregroundColor: e.target.value })
                    }
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    value={config.foregroundColor}
                    onChange={(e) =>
                      updateConfig({ foregroundColor: e.target.value })
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="background">Background Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="background"
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) =>
                      updateConfig({ backgroundColor: e.target.value })
                    }
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    value={config.backgroundColor}
                    onChange={(e) =>
                      updateConfig({ backgroundColor: e.target.value })
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Color Presets
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {presetColors.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleColorPreset(preset.foreground, preset.background)
                    }
                    className="flex items-center space-x-2 p-2 text-xs rounded-md border hover:bg-muted transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: preset.foreground }}
                    />
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: preset.background }}
                    />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Error Correction */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <Label className="text-base font-medium">Error Correction</Label>
          </div>

          <div>
            <Label htmlFor="error-correction">Error Correction Level</Label>
            <Select
              value={config.errorCorrectionLevel}
              onValueChange={(value: ErrorCorrectionLevel) =>
                updateConfig({ errorCorrectionLevel: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {errorCorrectionLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {level.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Higher error correction</strong> makes the QR code more
              robust against damage but increases its size.
              <br />
              <strong>Lower error correction</strong> creates smaller QR codes
              but they&apos;re more fragile.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
