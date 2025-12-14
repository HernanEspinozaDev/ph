
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSection() {
    return (
        <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-black text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1920&auto=format&fit=crop"
                    alt="Hamburguesa jugosa estilo fuente de soda"
                    fill
                    priority
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <h2 className="mb-2 text-lg font-medium tracking-widest text-[#FF4500] uppercase">
                    Tradición y Sabor
                </h2>
                <h1 className="mb-6 text-5xl font-black uppercase tracking-tight md:text-7xl lg:text-9xl text-white drop-shadow-lg">
                    La Fuente
                    <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600"> de Soda</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-gray-200 md:text-xl leading-relaxed">
                    Sándwiches gigantes, completos clásicos y schops bien fríos.
                    El sabor de siempre, con el toque moderno que te encanta.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        asChild
                        size="lg"
                        className="h-14 bg-[#FF4500] px-10 text-lg font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 hover:bg-[#FF4500]/90 shadow-[0_0_20px_rgba(255,69,0,0.5)] border-none rounded-full"
                    >
                        <Link href="/fuente-de-soda/cartamenu">
                            Ver Carta Completa
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-14 border-white bg-transparent px-10 text-lg font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black rounded-full"
                    >
                        <Link href="#destacados">
                            Platos Destacados
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
