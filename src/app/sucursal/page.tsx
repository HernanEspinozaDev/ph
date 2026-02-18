import { HeroSection } from '@/components/sucursal/HeroSection';
import { Header } from '@/features/layout/Header';
import { Footer } from '@/features/layout/Footer';
import { getMenu } from '@/app/actions/menu';
import { FeaturedCarousel } from '@/components/sucursal/FeaturedCarousel';

export const runtime = 'edge';

export default async function FuenteDeSodaPage() {
  const allProducts = await getMenu();

  const targetIds = [1, 8, 9, 35, 41, 45, 52, 55, 57, 59];

  const featuredProducts = allProducts.filter(p => targetIds.includes(p.id));

  // Sort by the order in targetIds
  featuredProducts.sort((a, b) => {
    return targetIds.indexOf(a.id) - targetIds.indexOf(b.id);
  });

  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main>
        <HeroSection />

        <section id="destacados" className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-light mb-4">Favoritos de la Casa</h3>
            <p className="text-muted-foreground mb-12">
              Descubre los platos que nos han hecho famosos en todo el barrio.
            </p>

            <FeaturedCarousel products={featuredProducts} />

            {featuredProducts.length === 0 && (
              <div className="bg-muted/30 p-12 rounded-lg border border-dashed border-muted-foreground/20">
                <p className="text-lg text-muted-foreground italic">
                  Cargando destacados...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
