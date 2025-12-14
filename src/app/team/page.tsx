import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Our Team</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Meet the talented individuals behind Pophams. Our team is a passionate group of bakers, chefs, baristas, and creatives dedicated to their craft.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
