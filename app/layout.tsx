import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AssessmentProvider } from "@/lib/assessment-context";
import { I18nProvider } from "@/lib/i18n-context";
import { Anek_Malayalam, Inter } from "next/font/google";
const anekMalayalam = Anek_Malayalam({
  subsets: ["latin"],
  variable: "--font-anek-malayalam",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healthy Life Campaign - Health Risk Assessment",
  description:
    "Check your health risks in 5 minutes. A free, private health risk assessment tool.",
  metadataBase: new URL("https://health.kerala.care"),
  openGraph: {
    title: "Healthy Life Campaign - Health Risk Assessment",
    description:
      "Check your health risks in 5 minutes. Free, private health risk assessment tool. Eat well · Act well · Sleep well · Care well",
    url: "https://health.kerala.care",
    siteName: "Healthy Life Campaign",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://health.kerala.care/hl-og.png",
        width: 1200,
        height: 630,
        alt: "Healthy Life Campaign - Eat well · Act well · Sleep well · Care well",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthy Life Campaign - Health Risk Assessment",
    description:
      "Check your health risks in 5 minutes. Free, private health risk assessment tool.",
    images: ["https://health.kerala.care/hl-og.png"],
  },
  keywords: [
    "health assessment",
    "health risk",
    "Kerala health",
    "preventive healthcare",
    "wellness check",
    "health screening",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${anekMalayalam.variable}`}>
      <body
        className={`antialiased min-h-screen bg-slate-50`}
      >
        <I18nProvider>
          <AssessmentProvider>{children}</AssessmentProvider>
        </I18nProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
