"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { generateCraftsmanshipDescription } from "@/ai/flows/generate-craftsmanship-description";
import { Button } from "@/components/ui/button";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialDescription = "La artesanía nos inspira, pero la verdadera esencia de nuestra marca son las personas, nuestro talentoso personal, nuestros encantadores clientes y los vibrantes barrios a los que servimos. Nuestras ubicaciones son espacios acogedores y relajados donde estas comunidades pueden reunirse para disfrutar de la comida y la bebida, celebrar el arte y experimentar una genuina sensación de hogar.";

export function CraftsmanshipSection({ image }: { image: ImagePlaceholder }) {
  const [description, setDescription] = useState(initialDescription);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const result = await generateCraftsmanshipDescription({
          currentDescription: description,
        });

        if (result && result.description) {
          setDescription(result.description);
        } else {
          throw new Error("Recibí una respuesta vacía de la IA.");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo generar una nueva descripción. Por favor, inténtalo de nuevo.",
        });
      }
    });
  };

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
                <Button
                    onClick={handleGenerate}
                    disabled={isPending}
                    variant="secondary"
                    className="mt-6 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                        </>
                    ) : (
                        "✨ Regenerar con IA"
                    )}
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
