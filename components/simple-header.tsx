"use client";

import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

export const SimpleHeader = () => {
  return (
    <header className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            JustProImages
          </Link>
        </div>
      </div>
    </header>
  );
};
