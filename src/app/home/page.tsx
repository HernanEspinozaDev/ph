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
            Explore our curated collection of homewares that enrich life's everyday rituals. Many of the handcrafted items from our bakeries—such as ceramics, linens, and glassware—are available through Pophams Home.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
