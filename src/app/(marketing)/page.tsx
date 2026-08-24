import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CraftsmanshipSection } from '@/components/CraftsmanshipSection';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { GoogleReviews } from '@/components/GoogleReviews';

// Helper to find image from placeholder data
const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback for safety, though it should not be triggered if JSON is correct
    return { id, description: 'Placeholder', imageUrl: `https://picsum.photos/seed/${id}/600/400`, imageHint: 'placeholder' };
  }
  return image;
};

export default function Home() {
  const heroImage = findImage('hero');
  const gridImages = [
    findImage('grid1'),
    findImage('grid2'),
    findImage('grid3'),
  ];
  const craftsmanshipImage = findImage('craftsmanship');
  const giftCardImage = findImage('giftcard');
  const biscuitsImage = findImage('biscuits');
  const hampersImage = findImage('hampers');

  const locations = [
    {
      name: 'Local Principal',
      address: 'Mariano Casanova 336 local 02, Cartagena, Valparaíso',
      hours: 'Ventas, consumo en local y retiro.',
    },
    {
      name: 'Solo Retiros',
      address: 'Caupolicán 1372, Cartagena, Valparaíso',
      hours: 'Solo retiro de pedidos.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] md:min-h-[800px] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-contain md:object-cover opacity-50"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl px-4 py-20 text-center text-white mx-4">
          <p className="mb-4 text-sm md:text-base font-semibold uppercase tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Pastelería, coctelería y comida rápida.
          </p>
          <h2 className="mb-6 font-medium tracking-tight text-6xl md:text-8xl lg:text-9xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Pastelería Hijitos
          </h2>
          <p className="mx-auto max-w-2xl text-base md:text-xl font-semibold leading-relaxed drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)]">
            Pastelería Hijitos es una pasteleria tradicional e innovadora. Usamos técnicas tradicionales y sabores innovadores para
            crear pasteles de gran sabor, junto con un menú cambiante de
            platos de temporada y bebidas deliciosas.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-20 bg-white">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <h3 className="text-4xl font-light text-primary">Nuestra Historia</h3>
            <p className="font-light leading-relaxed text-lg text-gray-700">
              Nuestra historia comienza en 2006, desde las calles de Cartagena, trabajando duro como vendedores ambulantes. 
              En un principio, nuestros hijos recorrían casa por casa ofreciendo nuestras preparaciones en bandejas. 
              Con mucho esfuerzo, fuimos perfeccionando nuestras recetas hasta llegar a los famosos pastelitos a $100, 
              que vendíamos cada verano en familia. 
            </p>
            <p className="font-light leading-relaxed text-lg text-gray-700">
              Hoy, gracias a ese trabajo conjunto de elaboración entre Lorena, Cristian y sus hijos, 
              Pastelería Hijitos ha crecido para ofrecerte mucho más: exquisita coctelería para eventos, 
              tortas personalizadas y la misma calidez familiar de siempre.
            </p>
            <div className="pt-4">
              <Button asChild className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
                <Link href="/about">LEER NUESTRA HISTORIA COMPLETA</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {gridImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-sm"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  data-ai-hint={image.imageHint}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Locations Section */}
      <section className="px-4 py-20 text-center bg-white">
        <div className="container mx-auto">
          <h3 className="mb-2 text-4xl font-light">Nuestras Ubicaciones</h3>
          <p className="mx-auto mb-12 max-w-lg text-muted-foreground">
            Ven a saludarnos a una de nuestras sucursales en Cartagena.
          </p>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {locations.map((location) => (
              <Card
                key={location.name}
                className="border-none bg-transparent text-center shadow-none"
              >
                <CardContent className="p-0">
                  <h4 className="mb-2 text-2xl font-light">
                    {location.name}
                  </h4>
                  <p className="font-light">{location.address}</p>
                  <p className="font-light">{location.hours}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
              <Link href="/locations">VER NUESTRAS UBICACIONES</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
