"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { generateCraftsmanshipDescription } from "@/ai/flows/generate-craftsmanship-description";
import { Button } from "@/components/ui/button";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialDescription = "Artisanal craftsmanship inspires us, but the true essence of our brand is people, our talented staff, lovely customers and the vibrant neighbourhoods we serve. Our locations are welcoming, laid-back spaces where these communities can gather to enjoy food and drink, celebrate artistry, and experience a genuine sense of home.";

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
          throw new Error("Received an empty response from AI.");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate a new description. Please try again.",
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
                            Generating...
                        </>
                    ) : (
                        "✨ Regenerate with AI"
                    )}
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
