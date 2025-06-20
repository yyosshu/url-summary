import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'URL要約アプリ',
  description: 'ウェブページのURLを入力して要約を生成します',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}