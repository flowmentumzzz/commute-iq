import type { Metadata } from "next";
import "@commute-iq/ui/styles/globals.css";

export const metadata: Metadata = {
  title: "Commute Wallet",
  description: "The money layer for Vietnam's real commute."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans">{children}</body>
    </html>
  );
}
