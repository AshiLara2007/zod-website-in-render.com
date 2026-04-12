import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZOD MANPOWER | Doha, Qatar.',
  description: 'Welcome To Doha, Qatar | ZOD MANPOWER.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
