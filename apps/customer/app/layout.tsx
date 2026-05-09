import type { Metadata } from "next";
import Script from "next/script";
import "@commute-iq/ui/styles/globals.css";

export const metadata: Metadata = {
  title: "Commute Wallet",
  description: "The money layer for Vietnam's real commute."
};

const themeBootstrapScript = `
(function () {
  try {
    var stored = window.localStorage.getItem('commute-iq:theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || ((stored === null || stored === 'system') && prefersDark);
    if (dark) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`.trim();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
