import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#40c4ff',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://setmybizz.com'),
  title: {
    default: "SetMyBizz | Online CA Services, Company Registration & Startup Banking OS",
    template: '%s | SetMyBizz AI Business OS',
  },
  description:
    "Get Pvt Ltd / LLP company registration online, GST & tax filings from certified CA experts, current account business banking setup, and automate operations with the World's First AI Business Operating System (BizOS). Start, run, and scale your startup with SetMyBizz.",
  keywords: [
    'worlds first AI business OS', "india's first AI business setup platform", 'worlds first AI co founder', 'worlds first AI startup launchpad', 
    'pvt ltd company registration', 'online company registration india', 'LLP incorporation online', 'register startup india',
    'online CA services', 'chartered accountant services online', 'GST registration and filing', 'income tax filing ITR', 'ROC legal compliance',
    'startup business banking', 'corporate current account setup', 'business bank account online', 'startup banking partners',
    'business setup visakhapatnam', 'msme registration udyam', 'trademark registration online', 'business automation suite'
  ],
  authors: [{ name: 'SetMyBizz', url: 'https://setmybizz.com' }],
  creator: 'SetMyBizz',
  publisher: 'SetMyBizz',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website', locale: 'en_IN', url: 'https://setmybizz.com', siteName: 'SetMyBizz',
    title: "SetMyBizz | Online CA Services, Company Registration & Startup Banking OS",
    description: "Get Pvt Ltd / LLP company registration online, GST & tax filings from certified CA experts, current account business banking setup, and automate operations with SetMyBizz.",
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'SetMyBizz — World\'s First AI Business OS' }],
  },
  twitter: {
    card: 'summary_large_image', site: '@setmybizz', creator: '@setmybizz',
    title: "SetMyBizz | Online CA Services, Company Registration & Startup Banking OS",
    description: "Get Pvt Ltd / LLP company registration online, GST & tax filings from certified CA experts, current account business banking setup, and automate operations with SetMyBizz.",
    images: ['/images/og-image.png'],
  },
  alternates: { canonical: 'https://setmybizz.com' },
  category: 'Business Software',
};

// All structured data for SEO
const LD_ORGANIZATION = {
  '@context': 'https://schema.org', '@type': 'Organization',
  name: 'SetMyBizz', url: 'https://setmybizz.com',
  logo: 'https://setmybizz.com/images/logo.png',
  description: "The World's First AI Business Operating System. India's pioneer in AI-powered business setup, AI Co-Founders, and AI Startup LaunchPads.",
  foundingDate: '2024',
  slogan: 'Start Here. Build Here. Run Here.',
  contactPoint: { '@type': 'ContactPoint', telephone: '+91-7893332884', contactType: 'Customer Support', areaServed: 'IN', availableLanguage: ['English', 'Hindi', 'Telugu'] },
  sameAs: ['https://twitter.com/setmybizz', 'https://linkedin.com/company/setmybizz', 'https://instagram.com/setmybizz'],
};

const LD_LOCAL_BUSINESS = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness',
  name: 'SetMyBizz - AI Business OS', image: 'https://setmybizz.com/images/logo.png',
  url: 'https://setmybizz.com', telephone: '+91-7893332884',
  address: { '@type': 'PostalAddress', addressLocality: 'Visakhapatnam', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' },
  geo: { '@type': 'GeoCoordinates', latitude: 17.6868, longitude: 83.2185 },
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' },
  priceRange: '₹₹',
};

const LD_SOFTWARE = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication',
  name: 'SetMyBizz AI Business OS', applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
  url: 'https://setmybizz.com',
  description: "The World's First AI Business Operating System. Introduces the World's First AI LaunchPad and AI Co-Founder for MSMEs and Startups, solving end-to-end business operations, legal setup, and brand identity without technical skills or expensive agencies.",
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_ORGANIZATION) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_LOCAL_BUSINESS) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_SOFTWARE) }} />
      </head>
      <body className={dmSans.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
