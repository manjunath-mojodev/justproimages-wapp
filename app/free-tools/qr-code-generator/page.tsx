"use client";

import { QRContentForm } from "@/components/qr/qr-content-form";
import { QRCustomization } from "@/components/qr/qr-customization";
import { QRPreview } from "@/components/qr/qr-preview";
import { QRTypeSelector } from "@/components/qr/qr-type-selector";
import { useHydrateStore } from "@/store/qr-store";
import React from "react";
import { Toaster } from "sonner";

const QrCodePage = () => {
  useHydrateStore();
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <QRTypeSelector />
            <QRContentForm />
            <QRCustomization />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            <QRPreview />
          </div>
        </div>
      </main>

      <Toaster position="top-right" expand={true} richColors={true} />
    </div>
  );
};

export default QrCodePage;
