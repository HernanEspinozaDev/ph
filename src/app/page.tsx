import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CraftsmanshipSection } from '@/components/CraftsmanshipSection';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
      name: 'Islington',
      address: '10 Prebend Street, N1 8DS',
      hours: 'Lun - Dom: 8am - 4pm',
    },
    {
      name: 'London Fields',
      address: '197 Richmond Road, E8 3NJ',
      hours: 'Lun - Dom: 8am - 4pm',
    },
    {
      name: 'Victoria Park',
      address: '110a Lauriston Road, E9 7HA',
      hours: 'Lun - Dom: 8am - 5pm',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative flex h-[85vh] min-h-[600px] items-center justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>
          <div className="relative z-10 max-w-4xl px-4 text-center text-primary-foreground">
            <p className="mb-4 text-sm font-light uppercase tracking-[0.3em]">
              Pastelería, coctelería y fuente de soda.
            </p>
            <h2 className="mb-8 font-light tracking-tight text-7xl md:text-9xl">
              Pastelería Hijitos
            </h2>
            <p className="mx-auto max-w-2xl text-base font-light leading-relaxed opacity-90 md:text-lg">
              Pastelería Hijitos es una pasteleria tradicional e innovadora. Usamos técnicas tradicionales y sabores innovadores para
              crear pasteles de gran sabor, junto con un menú cambiante de
              platos de temporada y bebidas deliciosas.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
              <div>
                <p className="font-light leading-relaxed">
                  Fundada en 2006, Pastelería Hijitos nació del sueño de llevar
                  innovación y sabor a la familia. Desde entonces, hemos
                  evolucionado hasta convertirnos en una marca de estilo de vida arraigada en la comunidad. Nuestros menús celebran sabores frescos y únicos,
                  mientras que nuestros artículos para el hogar cuidadosamente seleccionados enriquecen los
                  rituales cotidianos de la vida, ya sea en nuestras panaderías o en sus propios hogares.
                </p>
              </div>
              <div>
                <p className="font-light leading-relaxed">
                  Nuestro café es una mezcla de la casa, desarrollada y tostada en
                  colaboración con nuestros amigos de Ozone, y muchos de los
                  artículos hechos a mano de nuestras panaderías, como cerámicas, ropa de cama,
                  y cristalería, están disponibles a través de nuestra marca de artículos para el hogar,
                  Pophams Home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Image Grid */}
        <section className="px-4 py-12">
          <div className="container mx-auto">
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
              {gridImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden"
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

        {/* Craftsmanship Section */}
        <CraftsmanshipSection image={craftsmanshipImage} />

        {/* Locations Section */}
        <section className="px-4 py-20 text-center">
          <div className="container mx-auto">
            <h3 className="mb-2 text-4xl font-light">Nuestras Ubicaciones</h3>
            <p className="mx-auto mb-12 max-w-lg text-muted-foreground">
              Ven a saludarnos a una de nuestras panaderías en Islington, London
              Fields, o Victoria Park.
            </p>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
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
                    <Button asChild variant="link" className="mt-4 text-primary">
                      <Link href="#">Obtener Direcciones</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gift Card Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={giftCardImage.imageUrl}
                  alt={giftCardImage.description}
                  data-ai-hint={giftCardImage.imageHint}
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-4xl font-light">La Tarjeta Regalo Pastelería Hijitos</h3>
                <p className="font-light leading-relaxed">
                  Nuestra tarjeta se puede usar en nuestras panaderías, despensas y tiendas de
                  artículos para el hogar. Los clientes pueden comprar una tarjeta de regalo digital en línea o
                  comprar una en la tienda.
                </p>
                <Button className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
                  COMPRAR TARJETA REGALO
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Biscuits Section */}
        <section className="bg-white px-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
              <div className="space-y-6 md:order-1">
                <h3 className="text-4xl font-light">Compra nuestras Galletas</h3>
                <p className="font-light leading-relaxed">
                  Recién horneadas en London Fields, nuestras galletas están disponibles en
                  las tres panaderías y en Pastelería Hijitos Home. Elige entre chocolate y
                  sal marina ahumada, galleta de caramelo o cacahuete y cardamomo.
                </p>
                <Button className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
                  COMPRAR GALLETAS
                </Button>
              </div>
              <div className="relative aspect-square overflow-hidden bg-accent/30 md:order-2">
                <Image
                  src={biscuitsImage.imageUrl}
                  alt={biscuitsImage.description}
                  data-ai-hint={biscuitsImage.imageHint}
                  width={600}
                  height={600}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hampers Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={hampersImage.imageUrl}
                  alt={hampersImage.description}
                  data-ai-hint={hampersImage.imageHint}
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-4xl font-light">
                  Cestas Festivas Pastelería Hijitos
                </h3>
                <p className="font-light leading-relaxed">
                  Nuestra cesta Pastelería Hijitos está llena de productos hechos en casa por nuestros
                  chefs. Cada cesta viene en una canasta de mimbre tejida a mano y
                  contiene muchas delicias e incluso un pequeño toque
                  de Pastelería Hijitos para colgar en tu árbol.
                </p>
                <Button className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
                  COMPRAR DESPENSA
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
