"use client";

import { useHydrateStore } from "@/store/qr-store";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FreeToolsPage() {
  useHydrateStore();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Free Tools</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Discover our collection of free, powerful tools to help you create
            amazing content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">QR Code Generator</h3>
              <p className="text-muted-foreground mb-4">
                Create custom QR codes for URLs, text, WiFi, vCards, and more
                with advanced customization options.
              </p>
              <Button asChild className="w-full">
                <Link href="/free-tools/qr-code-generator">
                  Use Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Placeholder for future tools */}
            <div className="border rounded-lg p-6 opacity-50">
              <h3 className="text-xl font-semibold mb-3">Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                More amazing tools are on the way. Stay tuned!
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </div>

            <div className="border rounded-lg p-6 opacity-50">
              <h3 className="text-xl font-semibold mb-3">Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                More amazing tools are on the way. Stay tuned!
              </p>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
