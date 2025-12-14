import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Empleo</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Siempre estamos buscando gente apasionada para unirse a nuestro equipo. Si te interesa una carrera en Pophams, por favor envíanos tu CV.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
