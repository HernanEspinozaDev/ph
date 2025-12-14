import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Our Story</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Founded in 2017, Pophams was born from a dream to bring
            innovation and flavour to viennoiserie. Since then, we have
            evolved into a lifestyle brand rooted in community and
            craftsmanship. Our menus celebrate fresh flavours and unique
            tastes, while our carefully curated homewares enrich life's
            everyday rituals, whether in our bakeries or your own homes.
          </p>
          <p>
            Our coffee is a house blend, developed and roasted in
            partnership with our friends Ozone, and many of the
            handcrafted items from our bakeries—such as ceramics, linens,
            and glassware—are available through our homewares brand,
            Pophams Home.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
