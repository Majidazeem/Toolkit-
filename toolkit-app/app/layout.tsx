import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yalla Toolkit - Best Web Tools & Websites Directory',
  description: 'Curated directory of the web\'s most powerful tools, websites, and AI resources. Fast, organized, and constantly updated.',
  keywords: ['tools directory', 'web tools', 'AI tools', 'developer tools', 'free utilities'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
