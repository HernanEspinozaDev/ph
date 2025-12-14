import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PophamsHomePage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Pophams Home</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Explora nuestra colección curada de artículos para el hogar que enriquecen los rituales cotidianos de la vida. Muchos de los artículos hechos a mano de nuestras panaderías, como cerámicas, ropa de cama y cristalería, están disponibles a través de Pophams Home.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
