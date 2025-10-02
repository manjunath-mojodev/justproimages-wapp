import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QRCodeConfig } from "@/types/qr";
import { useEffect } from "react";

interface QRCodeStore {
  // Current QR code configuration
  config: QRCodeConfig;

  // Generated QR code data
  qrCodeDataUrl: string | null;
  qrCodeSvg: string | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  updateConfig: (config: Partial<QRCodeConfig>) => void;
  setQRCodeData: (dataUrl: string, svg: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultConfig: QRCodeConfig = {
  type: "url",
  content: "https://example.com",
  size: 256,
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
  errorCorrectionLevel: "M",
  margin: 4,
};

export const useQRCodeStore = create<QRCodeStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      qrCodeDataUrl: null,
      qrCodeSvg: null,
      isLoading: false,
      error: null,

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),

      setQRCodeData: (dataUrl, svg) =>
        set({
          qrCodeDataUrl: dataUrl,
          qrCodeSvg: svg,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    {
      name: "qr-code-storage",
      partialize: (state) => ({
        config: state.config,
      }),
      skipHydration: true,
    }
  )
);

// Hook to handle hydration
export const useHydrateStore = () => {
  useEffect(() => {
    useQRCodeStore.persist.rehydrate();
  }, []);
};
