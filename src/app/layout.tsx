import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  metadataBase: new URL('https://pasteleriahijitos.cl'),
  title: {
    default: 'Pastelería Hijitos | Pastelería en Cartagena',
    template: '%s | Pastelería Hijitos',
  },
  description: 'Pastelería familiar en Cartagena, Valparaíso. Conoce nuestras tortas, coctelería para eventos y preparaciones para compartir.',
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'Pastelería Hijitos',
    title: 'Pastelería Hijitos | Cartagena, Chile',
    description: 'Pastelería familiar, tortas y coctelería para eventos en Cartagena, Valparaíso.',
    url: 'https://pasteleriahijitos.cl/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&family=Source+Sans+Pro:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
