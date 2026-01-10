"use client";

import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

const description = "La artesanía nos inspira, pero la verdadera esencia de nuestra marca son las personas, nuestro talentoso personal, nuestros encantadores clientes y los vibrantes barrios a los que servimos. Nuestras ubicaciones son espacios acogedores y relajados donde estas comunidades pueden reunirse para disfrutar de la comida y la bebida, celebrar el arte y experimentar una genuina sensación de hogar.";

export function CraftsmanshipSection({ image }: { image: ImagePlaceholder }) {
  return (
    <section className="relative my-16 h-[600px] overflow-hidden bg-primary">
      <div className="absolute inset-0 opacity-40">
        <Image
          src={image.imageUrl}
          alt={image.description}
          data-ai-hint={image.imageHint}
          fill
          className="object-cover"
        />
      </div>
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl text-primary-foreground">
            <p className="text-lg font-light leading-relaxed md:text-xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
