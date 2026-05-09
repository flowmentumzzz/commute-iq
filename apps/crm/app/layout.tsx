import type { Metadata } from "next";
import "@commute-iq/ui/styles/globals.css";

export const metadata: Metadata = {
  title: "Commute Wallet CRM",
  description: "Operations workspace for Commute Wallet."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans">{children}</body>
    </html>
  );
}
