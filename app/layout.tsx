// app/layout.tsx
import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import type { Metadata } from 'next';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'The House Cafe',
  description: 'Premium Coffee & Cozy Vibes',
  icons: {
    icon: '../thehouse.png', // This sets the logo in the browser tab
    shortcut: '../thehouse.png',
  },
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