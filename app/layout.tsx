import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mail Adviser',
  description: 'メール文章推敲ツール',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mail Adviser',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#f8fafc] text-[#1e293b] antialiased">
        {children}
      </body>
    </html>
  );
}
