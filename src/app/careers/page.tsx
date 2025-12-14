import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Careers</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            We are always looking for passionate people to join our team. If you are interested in a career at Pophams, please send your CV to us.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
