import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <h1 className="mb-8 text-center text-5xl font-light">Contact Us</h1>
        <div className="mx-auto max-w-3xl space-y-6 text-center font-light leading-relaxed">
          <p>
            For any inquiries, please reach out to us. We would love to hear from you.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
