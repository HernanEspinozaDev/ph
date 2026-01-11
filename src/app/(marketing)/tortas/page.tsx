'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Dynamic import for masonry to avoid hydration issues
const Masonry = dynamic(
  () => import('react-responsive-masonry').then((mod) => mod.default),
  { ssr: false }
);
const ResponsiveMasonry = dynamic(
  () => import('react-responsive-masonry').then((mod) => mod.ResponsiveMasonry),
  { ssr: false }
);

// Hook for scroll reveal animations
function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function TortasPage() {
  // Activate scroll reveal animations
  useScrollReveal();

  // Track if component has mounted (for client-only rendering)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const baseImages = [
    '/images/tortas/hero-1.png',
    '/images/tortas/hero-2.png',
    '/images/tortas/hero-3.png',
  ];

  // Create 5 hero items by repeating base images
  const heroImages = Array.from({ length: 5 }).map((_, i) => baseImages[i % baseImages.length]);

  // function to generate gallery items with varying heights for masonry effect
  const heights = [300, 400, 350, 450, 320, 380, 420, 340, 360, 400];
  const generateGallery = (count: number) => Array.from({ length: count }).map((_, i) => ({
    id: i,
    src: baseImages[i % baseImages.length],
    alt: 'Torta Artesanal',
    height: heights[i % heights.length],
  }));

  const galleryPersonalizadas = generateGallery(9);
  const galleryEventos = generateGallery(9);
  const galleryMatrimonio = generateGallery(9);

  const MasonryGrid = ({ items }: { items: { id: number; src: string; alt: string; height: number }[] }) => {
    // Don't render on server to avoid hydration mismatch
    if (!isMounted) {
      return <div className="h-96 animate-pulse bg-gray-200 rounded-xl" />;
    }

    return (
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}
      >
        <Masonry gutter="12px">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl cursor-pointer animate-fade-in-up"
              style={{
                height: `${item.height}px`,
                animationDelay: `${index * 80}ms`
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={item.height}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 1. HERO SECTION (Carrusel) */}
      <section className="relative w-full">
        <Carousel
          className="w-full"
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
            {heroImages.map((src, index) => (
              <CarouselItem key={index} className="p-0">
                <div className="relative h-[85vh] w-full lg:h-[90vh]">
                  <Image
                    src={src}
                    alt={`Hero Cake ${index + 1}`}
                    fill
                    className="object-cover brightness-[0.65]"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
            <CarouselPrevious className="relative bg-white/20 text-white hover:bg-white/40 border-none" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
            <CarouselNext className="relative bg-white/20 text-white hover:bg-white/40 border-none" />
          </div>
        </Carousel>

        {/* Hero Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="mb-6 font-headline text-5xl font-bold text-white drop-shadow-xl md:text-7xl lg:text-8xl tracking-wide">
            Tortas a Pedido Personalizadas
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-8">
            {/* Botón 1: Scroll suave */}
            <Button
              asChild
              className="rounded-full bg-primary px-10 py-7 text-xl font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-primary/90"
            >
              <Link href="#seccion-pedidos" scroll={true}>Haz tu pedido</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. SECCIONES DE GALERÍA MASONRY */}
      <div className="mx-auto max-w-6xl px-4 py-24 space-y-24">
        {/* Sección A */}
        <section className="scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0">
          <div className="mb-10 text-center">
            <h2 className="font-headline text-3xl text-primary md:text-4xl lg:text-5xl">Tortas Personalizadas</h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-accent/40 rounded-full" />
          </div>
          <MasonryGrid items={galleryPersonalizadas} />
        </section>

        {/* Sección B */}
        <section className="scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0">
          <div className="mb-10 text-center">
            <h2 className="font-headline text-3xl text-primary md:text-4xl lg:text-5xl">Tortas de Eventos</h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-accent/40 rounded-full" />
          </div>
          <MasonryGrid items={galleryEventos} />
        </section>

        {/* Sección C */}
        <section className="scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0">
          <div className="mb-10 text-center">
            <h2 className="font-headline text-3xl text-primary md:text-4xl lg:text-5xl">Tortas de Matrimonio</h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-accent/40 rounded-full" />
          </div>
          <MasonryGrid items={galleryMatrimonio} />
        </section>
      </div>

      {/* 3. SECCIÓN PEDIDOS (Scroll Anchor) */}
      <section id="seccion-pedidos" className="relative bg-stone-900 py-32 text-center text-white">
        {/* Using one of the hero images as background */}
        <div className="absolute inset-0">
          <Image
            src="/images/tortas/hero-2.png"
            alt="Background"
            fill
            className="object-cover opacity-10"
          />
        </div>

        <div className="container relative mx-auto px-4 z-10">
          <h2 className="mb-8 font-headline text-4xl md:text-6xl">Diseña tu Torta Soñada</h2>

          <div className="mx-auto mb-12 max-w-3xl rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10">
            <p className="text-xl font-light leading-relaxed text-stone-200">
              Cada celebración es única. Cuéntanos tu idea, sabores favoritos y cantidad de invitados.
              <br /><br />
              <span className="font-medium text-accent">Importante:</span><br />
              Avisar con <span className="text-white font-semibold">5 días de anticipación</span>.<br />
              Se requiere abonar un <span className="text-white font-semibold">50% del precio total</span> para reservar.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap justify-center gap-12 text-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📱</span>
                <span className="font-medium">+569 9088 8617</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">📱</span>
                <span className="font-medium">+569 8742 1819</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">📸</span>
                <a href="https://instagram.com/pasteleria.hijitos" className="font-medium hover:text-accent transition-colors">@pasteleria.hijitos</a>
              </div>
            </div>

            <Button
              asChild
              className="mt-8 rounded-full bg-accent px-12 py-8 text-xl font-bold text-stone-900 shadow-[0_0_30px_rgba(255,182,193,0.3)] transition-all hover:scale-105 hover:bg-white hover:text-accent"
            >
              <Link href="/contact">Solicitar Cotización</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
