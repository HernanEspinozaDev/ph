import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function OrderOnlinePage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Pedir en Línea</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Disfruta de Pophams en casa. Pide tus pasteles, panes y cafés favoritos para recoger o a domicilio.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
