import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LEGEND MOD TOOLKIT - Official Platform by MA LEGEND',
  description: 'Official directory of the best web tools, utilities, mods and websites curated by MA LEGEND. Fast, powerful, and constantly updated.',
  keywords: ['LEGEND MOD TOOLKIT', 'MA LEGEND', 'LEGEND MOD', 'web tools', 'utilities', 'mods', 'free tools'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07070a] text-slate-100 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
