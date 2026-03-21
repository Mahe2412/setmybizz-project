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
    default: "SetMyBizz | World's First AI Business OS & India's #1 Setup Platform",
    template: '%s | SetMyBizz AI Business OS',
  },
  description:
    "Launch, run & scale your startup seamlessly with SetMyBizz — the World's First AI Business Operating System. Featuring the World's First AI Co-Founder and AI Startup LaunchPad. Get Company Registration, GST, Trademark, and entire brand presence built instantly.",
  keywords: [
    'worlds first AI business OS', "india's first AI business setup platform", 'worlds first AI co founder', 'worlds first AI startup launchpad', 
    'business registration india', 'pvt ltd registration online', 'GST registration',
    'AI operations platform', 'AI brand identity', 'AI startup builder',
    'trademark registration india', 'company incorporation', 'AI business platform india',
    'startup tools india', 'MSME registration', 'IEC code', 'business setup visakhapatnam',
    'AI co-founder', 'setmybizz', 'business operating system', 'business automation suite'
  ],
  authors: [{ name: 'SetMyBizz', url: 'https://setmybizz.com' }],
  creator: 'SetMyBizz',
  publisher: 'SetMyBizz',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website', locale: 'en_IN', url: 'https://setmybizz.com', siteName: 'SetMyBizz',
    title: "SetMyBizz | World's First AI Business OS",
    description: "Launch, run & scale your startup seamlessly with SetMyBizz. The World's First AI Co-Founder, AI LaunchPad, and comprehensive business setup—all in one place.",
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'SetMyBizz — World\'s First AI Business OS' }],
  },
  twitter: {
    card: 'summary_large_image', site: '@setmybizz', creator: '@setmybizz',
    title: "SetMyBizz | World's First AI Business OS",
    description: "Worlds first AI Startup LaunchPad and AI Co-Founder. Setup, build, run, and scale your business effortlessly.",
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
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
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