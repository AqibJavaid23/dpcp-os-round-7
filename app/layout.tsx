import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dental Practice Copilot OS",
  description: "The daily operating app for Dental Practice Copilot. Prototype with fictional data.",
  applicationName: "Dental Practice Copilot OS",
  appleWebApp: {
    capable: true,
    title: "DPCP OS",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/brand/logos/app-icons/favicon.ico" },
      { url: "/brand/logos/app-icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/logos/app-icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/brand/logos/app-icons/apple-touch-icon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B254B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
