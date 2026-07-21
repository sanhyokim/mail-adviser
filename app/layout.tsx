import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mail Adviser',
  description: 'メール文章推敲ツール',
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
