'use server';

/**
 * @fileOverview A flow that generates creative descriptions for Pophams' craftsmanship values.
 *
 * - generateCraftsmanshipDescription - A function that generates the craftsmanship description.
 * - GenerateCraftsmanshipDescriptionInput - The input type for the generateCraftsmanshipDescription function.
 * - GenerateCraftsmanshipDescriptionOutput - The return type for the generateCraftsmanshipDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCraftsmanshipDescriptionInputSchema = z.object({
  currentDescription: z
    .string()
    .describe('La descripción actual de los valores de artesanía de Pophams.'),
});
export type GenerateCraftsmanshipDescriptionInput =
  z.infer<typeof GenerateCraftsmanshipDescriptionInputSchema>;

const GenerateCraftsmanshipDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('La descripción creativa generada por IA de los valores de artesanía de Pophams.'),
});
export type GenerateCraftsmanshipDescriptionOutput =
  z.infer<typeof GenerateCraftsmanshipDescriptionOutputSchema>;

export async function generateCraftsmanshipDescription(
  input: GenerateCraftsmanshipDescriptionInput
): Promise<GenerateCraftsmanshipDescriptionOutput> {
  return generateCraftsmanshipDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCraftsmanshipDescriptionPrompt',
  input: {schema: GenerateCraftsmanshipDescriptionInputSchema},
  output: {schema: GenerateCraftsmanshipDescriptionOutputSchema},
  prompt: `Eres un redactor creativo para Pophams, una panadería artesanal conocida por su compromiso con la artesanía, su talentoso personal y su enfoque en la comunidad. La descripción actual es: {{{currentDescription}}}. Genera una nueva y atractiva descripción que capture la esencia de los valores de Pophams. Enfócate en el arte, el talento y la comunidad. Sé conciso, pero detallado. Sé lo más evocador y persuasivo posible. La descripción generada debe tener solo unas pocas frases. La respuesta debe estar en español.`,
});

const generateCraftsmanshipDescriptionFlow = ai.defineFlow(
  {
    name: 'generateCraftsmanshipDescriptionFlow',
    inputSchema: GenerateCraftsmanshipDescriptionInputSchema,
    outputSchema: GenerateCraftsmanshipDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
