
 // src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/archivo-latin.woff2",
  weight: "700 900",
  variable: "--font-archivo",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-400-latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),

  title: {
    default:
      "Travel Agency in Katra | Jammu, Kashmir & Himachal Tour Packages | Plan My Trip",
    template: `%s | ${site.name}`,
  },

  description:
    "Plan My Trip offers Vaishno Devi yatra, Jammu and Kashmir tours, and Himachal Pradesh holiday packages from Katra. Call or WhatsApp 70062 98659 to discuss your trip.",

  applicationName: site.name,

  icons: {
    icon: [{ url: site.logo, type: "image/png" }],
    shortcut: [{ url: site.logo, type: "image/png" }],
    apple: [{ url: site.logo, type: "image/png" }],
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    images: [site.logo],
  },

  twitter: {
    card: "summary_large_image",
    images: [site.logo],
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2a5b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Google Analytics 4 Measurement ID
const GA_ID = "G-LN2K37W5SP";

// Set NEXT_PUBLIC_GTM_ID in Vercel to enable Google Tag Manager.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim();

// Travel Agency structured data
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${site.url}/#travel-agency`,
    name: site.name,
    url: site.url,
    logo: new URL(site.logo, site.url).toString(),
    telephone: site.phoneE164,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: [
      "Katra",
      "Jammu",
      "Jammu and Kashmir",
      "Srinagar",
      "Kashmir",
      "Himachal Pradesh",
      "Shimla",
      "Manali",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${inter.variable}`}
    >
      <body>
        {/* Google Tag Manager */}
        {GTM_ID ? (
          <>
            <Script
              id="google-tag-manager"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){
                    w[l]=w[l]||[];
                    w[l].push({
                      'gtm.start': new Date().getTime(),
                      event:'gtm.js'
                    });
                    var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),
                        dl=l!='dataLayer'?'&l='+l:'';
                    j.async=true;
                    j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;
                    f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />

            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{
                  display: "none",
                  visibility: "hidden",
                }}
                title="Google Tag Manager"
              />
            </noscript>
          </>
        ) : (
          /* Fallback: direct GA4 tracking when GTM is not configured */
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />

            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer = window.dataLayer || [];
                window.gtag = function(){
                  window.dataLayer.push(arguments);
                };
                window.gtag('js', new Date());
                window.gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {children}
      </body>
    </html>
  );
}
