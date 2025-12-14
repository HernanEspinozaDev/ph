import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LocationsPage() {
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
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Our Locations</h1>
        <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
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
      </main>
      <Footer />
    </div>
  );
}
