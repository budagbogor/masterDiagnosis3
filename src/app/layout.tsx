import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AIConnectionNotification } from "@/components/ai-connection-notification";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoDiag Master AI - Diagnosa Kerusakan Mobil dengan AI Teknisi Otomotif",
  description: "Alat bantu diagnosa kerusakan mobil modern dengan AI Master Teknisi berpengalaman 20+ tahun. Kurangi waktu diagnosa hingga 40% dan akurasi diagnosa profesional.",
  keywords: ["AutoDiag", "AI diagnosa mobil", "teknisi otomotif", "diagnosa kerusakan mobil", "SOP perbaikan", "riwayat diagnosa"],
  authors: [{ name: "AutoDiag Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AutoDiag Master AI - Diagnosa Kerusakan Mobil",
    description: "Alat bantu diagnosa kerusakan mobil modern dengan AI Master Teknisi Otomotif berpengalaman 20+ tahun",
    url: "https://autodiag.ai",
    siteName: "AutoDiag Master AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoDiag Master AI - Diagnosa Kerusakan Mobil",
    description: "Alat bantu diagnosa kerusakan mobil modern dengan AI Master Teknisi Otomotif berpengalaman 20+ tahun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClassName = `${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyClassName} suppressHydrationWarning>
        {children}
        <Toaster />
        <AIConnectionNotification />
      </body>
    </html>
  );
}
