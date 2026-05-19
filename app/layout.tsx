import type { Metadata } from "next";
import { Merienda, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { WeddingProvider } from "./_lib/context";
import { getWeddingData } from "./_lib/wedding-data";
import { SunsetNav } from "./_components/SunsetNav";
import { SunsetFooter } from "./_components/SunsetFooter";
import "./globals.css";

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  let brideFirst = "Tuana";
  let groomFirst = "Ateş";
  try {
    const data = await getWeddingData();
    brideFirst = data.brideName.split(" ")[0];
    groomFirst = data.groomName.split(" ")[0];
  } catch {}

  const title = `${brideFirst} & ${groomFirst}`;
  const description = `${brideFirst} ve ${groomFirst} düğün davetiyesi.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${title}` },
    description,
    alternates: { canonical: "/" },
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: title,
      title,
      description,
      locale: "tr_TR",
    },
    twitter: { card: "summary_large_image", title, description },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const weddingData = await getWeddingData();

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      style={{ colorScheme: "dark" }}
      className={`${merienda.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body
        className="min-h-full flex flex-col bg-[#1a0f0a] text-[#faf0e6]"
        suppressHydrationWarning
      >
        {/* Zarf intro FOUC engeli: anahtar EnvelopeIntro.tsx içindeki STORAGE_KEY ile aynı olmalı. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('ta-envelope-opened')==='1')document.documentElement.classList.add('ta-envelope-seen')}catch(e){}",
          }}
        />
        <WeddingProvider data={weddingData}>
          <div className="relative min-h-screen overflow-x-hidden">
            <SunsetNav />
            <main>{children}</main>
            <SunsetFooter />
          </div>
        </WeddingProvider>
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
