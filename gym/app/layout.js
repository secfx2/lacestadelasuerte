import { Inter, Space_Grotesk } from 'next/font/google';
import Nav from '../components/Nav';
import SyncAgent from '../components/SyncAgent';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap', weight: ['500', '600', '700'] });

export const metadata = {
  title: 'Aesthetic Coach',
  description: 'Tu plan privado de entreno y dieta',
  robots: { index: false, follow: false, nocache: true },
  appleWebApp: { capable: true, title: 'Aesthetic', statusBarStyle: 'black-translucent' },
  icons: { icon: '/icon-192.png', apple: '/apple-touch-icon.png' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0b10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <main className="app">{children}</main>
        <Nav />
        <SyncAgent />
      </body>
    </html>
  );
}
