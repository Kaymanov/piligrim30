import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeferredWidgets } from "@/components/layout/DeferredWidgets";
import { TopProgressBar } from "@/components/ui/TopProgressBar";
import { getSEOConfiguration, productionIndexingAllowed, PRODUCTION_ORIGIN } from "@/lib/seo";
import { OrganizationSchema } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSEOConfiguration();
  return {
    metadataBase: new URL(PRODUCTION_ORIGIN),
    title: config.site_name,
    description: config.default_description,
    robots: {
      index: productionIndexingAllowed() && config.indexing_enabled,
      follow: productionIndexingAllowed(),
    },
    verification: {
      ...(config.google_verification && { google: config.google_verification }),
      ...(config.yandex_verification && { yandex: config.yandex_verification }),
    },
  };
}

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
          <TopProgressBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <DeferredWidgets />
          <OrganizationSchema />
        </ThemeProvider>
      </body>
    </html>
  );
}
