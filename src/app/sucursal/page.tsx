import { HeroSection } from '@/components/sucursal/HeroSection';
import { Header } from '@/features/layout/Header';
import { Footer } from '@/features/layout/Footer';

export default function FuenteDeSodaPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main>
        <HeroSection />

        {/* Featured Section (Placeholder for now) */}
        <section id="destacados" className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-light mb-4">Favoritos de la Casa</h3>
            <p className="text-muted-foreground mb-8">
              Descubre los platos que nos han hecho famosos en todo el barrio.
            </p>
            <div className="bg-muted/30 p-12 rounded-lg border border-dashed border-muted-foreground/20">
              <p className="text-lg text-muted-foreground italic">
                Sección de destacados próximamente...
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
