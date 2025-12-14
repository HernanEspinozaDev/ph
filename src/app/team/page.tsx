import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Nuestro Equipo</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Conoce a las personas talentosas detrás de Pophams. Nuestro equipo es un grupo apasionado de panaderos, chefs, baristas y creativos dedicados a su oficio.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
