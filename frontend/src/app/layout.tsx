import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeferredWidgets } from "@/components/layout/DeferredWidgets";
import { Preloader } from "@/components/ui/Preloader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const isProduction =
  process.env.NEXT_PUBLIC_SITE_URL === "https://piligrim30.ru";

export const metadata: Metadata = {
  title: {
    default: "Правовой Пилигрим | Банкротство в Астрахани",
    template: "%s | Правовой Пилигрим",
  },
  description: "Правовой Пилигрим | Банкротство в Астрахани",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://piligrim30.ru",
  ),
  // Block indexing on test/staging domains
  ...(!isProduction && { robots: { index: false, follow: false } }),
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
      className={`${inter.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-FOUC: apply theme synchronously before first paint.
            Default is dark. Prevents the light→dark flash on load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d;if(t==='light'){d=false;}else if(t==='dark'){d=true;}else if(t==='system'){d=window.matchMedia('(prefers-color-scheme: dark)').matches;}else{d=true;}var r=document.documentElement;if(d){r.classList.add('dark');}else{r.classList.remove('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <Preloader />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <DeferredWidgets />
        </ThemeProvider>
      </body>
    </html>
  );
}
