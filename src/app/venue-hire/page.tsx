import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function VenueHirePage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Venue Hire</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            Our beautiful spaces are available for private hire. Host your next event with us for a memorable experience.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
