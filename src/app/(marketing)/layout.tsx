import { Header } from '@/features/layout/Header';
import { Footer } from '@/features/layout/Footer';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-primary">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
