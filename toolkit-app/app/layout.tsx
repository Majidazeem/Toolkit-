import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#DC2626',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.legendmod.net'),
  title: 'LEGEND MOD TOOLKIT - Official Platform by MA LEGEND',
  description: 'Discover elite AI models, developer tools, VIP mods, free LH web hosting & utilities curated with power by MA LEGEND.',
  keywords: ['LEGEND MOD TOOLKIT', 'MA LEGEND', 'LEGEND MOD', 'legendmod.net', 'web hosting', 'mods', 'free tools', 'developer toolkit'],
  authors: [{ name: 'MA LEGEND' }],
  creator: 'MA LEGEND',
  publisher: 'LEGEND MOD',
  applicationName: 'LEGEND MOD TOOLKIT',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: ['/favicon.ico']
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.legendmod.net',
    siteName: 'LEGEND MOD TOOLKIT',
    title: 'LEGEND MOD TOOLKIT - Official Platform by MA LEGEND',
    description: 'Discover elite AI models, developer tools, VIP mods, free LH web hosting & utilities curated with power by MA LEGEND.',
    images: [
      {
        url: 'https://www.legendmod.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LEGEND MOD TOOLKIT - Curated with Power by MA LEGEND',
        type: 'image/jpeg'
      },
      {
        url: 'https://www.legendmod.net/og-square.jpg',
        width: 600,
        height: 600,
        alt: 'LEGEND MOD Crest Logo - MA LEGEND',
        type: 'image/jpeg'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LEGEND MOD TOOLKIT - Official Platform by MA LEGEND',
    description: 'Discover elite AI models, developer tools, VIP mods, free LH web hosting & utilities curated with power by MA LEGEND.',
    images: ['https://www.legendmod.net/og-image.jpg'],
    creator: '@legendmod407'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.legendmod.net',
  },
  verification: {
    google: 'google0312b2665d8af901',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.legendmod.net/#website',
        url: 'https://www.legendmod.net/',
        name: 'LEGEND MOD TOOLKIT',
        description: 'Discover elite AI models, developer tools, VIP mods, free LH web hosting & utilities curated with power by MA LEGEND.',
        inLanguage: 'en-US',
        publisher: {
          '@type': 'Organization',
          '@id': 'https://www.legendmod.net/#organization',
          name: 'LEGEND MOD',
          url: 'https://www.legendmod.net/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.legendmod.net/logo.png',
            width: 512,
            height: 512,
          },
          sameAs: [
            'https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x',
            'https://www.youtube.com/@legendmod407',
          ],
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.legendmod.net/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.legendmod.net/#organization',
        name: 'LEGEND MOD',
        url: 'https://www.legendmod.net/',
        logo: 'https://www.legendmod.net/logo.png',
        founder: {
          '@type': 'Person',
          name: 'MA LEGEND',
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Google Search Console Verification Meta Tag */}
        <meta name="google-site-verification" content="google0312b2665d8af901" />
        {/* Direct OpenGraph fallback meta tags for WhatsApp & Telegram */}
        <meta property="og:image" content="https://www.legendmod.net/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://www.legendmod.net/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="LEGEND MOD TOOLKIT by MA LEGEND" />
        {/* JSON-LD Structured Data Schema for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
