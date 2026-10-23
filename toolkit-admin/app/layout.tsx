import type { Metadata } from 'next';
import './globals.css';
import AuthGuard from '../components/AuthGuard';

export const metadata: Metadata = {
  title: 'Yalla Toolkit - Admin Control Center',
  description: 'Control panel to manage tools, categories, submissions, and website settings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f172a] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
