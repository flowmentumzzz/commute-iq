import type { Metadata } from "next";
import { Bricolage_Grotesque, Be_Vietnam_Pro, DM_Mono } from "next/font/google";
import Script from "next/script";
import "@commute-iq/ui/styles/globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap"
});

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap"
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Commute.vn",
  description: "Thấy tiền đi lại của bạn rõ ràng — app tài chính cho người Việt thực sự đi lại."
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
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="font-sans">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
