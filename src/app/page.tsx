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
      hours: 'Mon - Sun: 8am - 4pm',
    },
    {
      name: 'London Fields',
      address: '197 Richmond Road, E8 3NJ',
      hours: 'Mon - Sun: 8am - 4pm',
    },
    {
      name: 'Victoria Park',
      address: '110a Lauriston Road, E9 7HA',
      hours: 'Mon - Sun: 8am - 5pm',
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
              Bakery & Homeware
            </p>
            <h2 className="mb-8 font-light tracking-tight text-7xl md:text-9xl">
              Pophams
            </h2>
            <p className="mx-auto max-w-2xl text-base font-light leading-relaxed opacity-90 md:text-lg">
              Pophams is a collection of artisanal bakeries and lifestyle
              stores. We use traditional techniques and innovative flavours to
              create great tasting pastries, alongside a changing menu of
              seasonal dishes and delicious drinks.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto">
            <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
              <div>
                <p className="font-light leading-relaxed">
                  Founded in 2017, Pophams was born from a dream to bring
                  innovation and flavour to viennoiserie. Since then, we have
                  evolved into a lifestyle brand rooted in community and
                  craftsmanship. Our menus celebrate fresh flavours and unique
                  tastes, while our carefully curated homewares enrich life's
                  everyday rituals, whether in our bakeries or your own homes.
                </p>
              </div>
              <div>
                <p className="font-light leading-relaxed">
                  Our coffee is a house blend, developed and roasted in
                  partnership with our friends Ozone, and many of the
                  handcrafted items from our bakeries—such as ceramics, linens,
                  and glassware—are available through our homewares brand,
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
            <h3 className="mb-2 text-4xl font-light">Our Locations</h3>
            <p className="mx-auto mb-12 max-w-lg text-muted-foreground">
              Come and say hello at one of our bakeries in Islington, London
              Fields, or Victoria Park.
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
                      <Link href="#">Get Directions</Link>
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
                <h3 className="text-4xl font-light">The Pophams Gift Card</h3>
                <p className="font-light leading-relaxed">
                  Our card can be spent across our bakeries, pantry and homeware
                  shops. Customers can buy a digital gift card online or
                  purchase one in store.
                </p>
                <Button className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
                  SHOP GIFT CARD
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
                <h3 className="text-4xl font-light">Shop our Biscuits</h3>
                <p className="font-light leading-relaxed">
                  Freshly baked in London Fields, our biscuits are stocked in
                  all three bakeries and Pophams Home. Choose from chocolate &
                  smoked sea salt, caramel shortbread or peanut & cardamom.
                </p>
                <Button className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
                  SHOP BISCUITS
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
                  Pophams Festive Hampers
                </h3>
                <p className="font-light leading-relaxed">
                  Our Pophams hamper is full of goods made in-house by our
                  chefs. Each hamper comes in a handwoven wicker basket and
                  contains lots of delicious treats and even a little touch of
                  Pophams to hang on your tree.
                </p>
                <Button className="bg-primary px-8 py-6 text-sm font-light text-primary-foreground hover:bg-primary/90">
                  SHOP PANTRY
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
