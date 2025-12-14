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
    .describe('The current description of Pophams craftsmanship values.'),
});
export type GenerateCraftsmanshipDescriptionInput =
  z.infer<typeof GenerateCraftsmanshipDescriptionInputSchema>;

const GenerateCraftsmanshipDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('The AI-generated creative description of Pophams craftsmanship values.'),
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
  prompt: `You are a creative copywriter for Pophams, an artisanal bakery known for its commitment to craftsmanship, talented staff, and community focus. The current description is: {{{currentDescription}}}. Generate a new, engaging description that captures the essence of Pophams' values. Focus on artistry, talent, and community. Be concise, but detailed. Be as evocative and persuasive as possible. The generated description should only be a few sentences long.`,
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
