import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@/components/arc/foundation.css";
import "./globals.css";
import "./transition.css";
import { ThemeTransitionScript } from "@/components/transitions/theme-transition";
import { ThemeProvider } from "./theme-provider";

export const metadata: Metadata = {
  title: "FxTwitter — X の投稿を Discord できれいに見せる",
  description: "X(Twitter)の投稿 URL を、Discord などで画像・動画つきのプレビューになる URL に変換します。",
  metadataBase: new URL("https://fxx.lapius7.com"),
  openGraph: {
    type: "website",
    siteName: "FxTwitter",
    title: "FxTwitter — X の投稿を Discord できれいに見せる",
    description: "X(Twitter)の投稿 URL を、Discord などで画像・動画つきのプレビューになる URL に変換します。",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};
export const viewport: Viewport = { colorScheme: "light dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-accent="green" suppressHydrationWarning>
      <head>
        <ThemeTransitionScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
