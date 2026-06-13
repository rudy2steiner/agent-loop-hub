import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeManager from "@/components/ThemeManager";
import { parseThemeCookie, themeInitScript, THEME_COOKIE } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentloophub.com"),
  title: {
    default: "agentLoopHub — Loop Engineering Templates & Tools",
    template: "%s · agentLoopHub",
  },
  description:
    "Copy-paste agent loop templates for Claude Code, Codex and OpenClaw — cron triggers, verify steps, exit conditions and real token costs per cycle.",
  alternates: { canonical: "/" },
  openGraph: { siteName: "agentLoopHub", type: "website", url: "https://agentloophub.com" },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const savedTheme = parseThemeCookie(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <html lang="en" suppressHydrationWarning {...(savedTheme ? { "data-theme": savedTheme } : {})}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script defer data-domain="agentloophub.com" src="https://app.pageview.app/js/script.js"></script>
      </head>
      <body>
        <ThemeManager />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
