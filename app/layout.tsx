// app/layout.tsx
import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next'; // Import Viewport

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'The House Cafe',
  description: 'Premium Coffee & Cozy Vibes',
  manifest: '/manifest.json', // Link the manifest here
  icons: {
    icon: '/thehouse.png',
    shortcut: '/thehouse.png',
    apple: '/thehouse.png', // For iOS
  },
};

// Separate viewport export for Next.js 14+
export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming for an "App-like" feel
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans bg-[#1A1A1A]`}>
        {children}
      </body>
    </html>
  );
}