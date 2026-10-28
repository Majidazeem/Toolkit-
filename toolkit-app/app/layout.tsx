import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#DC2626',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://legendmod.net'),
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
    url: 'https://legendmod.net',
    siteName: 'LEGEND MOD TOOLKIT',
    title: 'LEGEND MOD TOOLKIT - Official Platform by MA LEGEND',
    description: 'Discover elite AI models, developer tools, VIP mods, free LH web hosting & utilities curated with power by MA LEGEND.',
    images: [
      {
        url: 'https://legendmod.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LEGEND MOD TOOLKIT - Curated with Power by MA LEGEND',
        type: 'image/jpeg'
      },
      {
        url: 'https://legendmod.net/og-square.jpg',
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
    images: ['https://legendmod.net/og-image.jpg'],
    creator: '@legendmod407'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Direct OpenGraph fallback meta tags for WhatsApp & Telegram */}
        <meta property="og:image" content="https://legendmod.net/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://legendmod.net/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="LEGEND MOD TOOLKIT by MA LEGEND" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
