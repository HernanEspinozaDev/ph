

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LocationsPage() {
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
    <div className="min-h-screen bg-background text-primary">
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Nuestras Ubicaciones</h1>
        <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
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

        <div className="mt-16 mx-auto max-w-4xl">
          <h3 className="mb-6 text-center text-3xl font-light">Encuéntranos</h3>
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.230151672715!2d-71.60251939999999!3d-33.5473961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96623fd1f46f86c9%3A0xbcf7cf026c1c273!2sPasteler%C3%ADa%20Hijitos!5e0!3m2!1ses!2scl!4v1787531468586!5m2!1ses!2scl" 
              className="w-full h-full" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
      
    </div>
  );
}
