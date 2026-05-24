import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Правовой Пилигрим | Банкротство в Астрахани",
    template: "%s | Правовой Пилигрим",
  },
  description: "Правовой Пилигрим | Банкротство в Астрахани",
  metadataBase: new URL("https://piligrim30.ru"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Правовой Пилигрим",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
