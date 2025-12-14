import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Eventos</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Acompáñanos en eventos especiales en nuestras panaderías. Desde talleres hasta cenas, siempre hay algo sucediendo en Pastelería Hijitos.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
