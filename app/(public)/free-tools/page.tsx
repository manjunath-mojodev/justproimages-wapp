"use client";

import { useHydrateStore } from "@/store/qr-store";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode, Layers, Image, Palette, Type } from "lucide-react";
import {
  freeTools,
  getActiveTools,
  getComingSoonTools,
} from "@/config/free-tools";

const iconMap = {
  QrCode,
  Layers,
  Image,
  Palette,
  Type,
};

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
            {getActiveTools().map((tool) => {
              const IconComponent = tool.icon
                ? iconMap[tool.icon as keyof typeof iconMap]
                : null;
              return (
                <div
                  key={tool.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {IconComponent && (
                      <IconComponent className="h-6 w-6 text-primary" />
                    )}
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  <Button asChild className="w-full">
                    <Link href={tool.href}>
                      Use Tool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              );
            })}

            {getComingSoonTools().map((tool) => {
              const IconComponent = tool.icon
                ? iconMap[tool.icon as keyof typeof iconMap]
                : null;
              return (
                <div key={tool.id} className="border rounded-lg p-6 opacity-50">
                  <div className="flex items-center gap-3 mb-3">
                    {IconComponent && (
                      <IconComponent className="h-6 w-6 text-muted-foreground" />
                    )}
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
