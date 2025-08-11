'use server';

/**
 * @fileOverview A Genkit flow to generate concept art images from a task description.
 *
 * - generateConceptImage - A function that generates an image based on a text prompt.
 * - GenerateConceptImageInput - The input type for the generateConceptImage function.
 * - GenerateConceptImageOutput - The return type for the generateConceptImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConceptImageInputSchema = z.object({
  description: z.string().describe('The task description to be used as a prompt for image generation.'),
});
export type GenerateConceptImageInput = z.infer<typeof GenerateConceptImageInputSchema>;

const GenerateConceptImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateConceptImageOutput = z.infer<typeof GenerateConceptImageOutputSchema>;

export async function generateConceptImage(input: GenerateConceptImageInput): Promise<GenerateConceptImageOutput> {
  return generateConceptImageFlow(input);
}

const generateConceptImageFlow = ai.defineFlow(
  {
    name: 'generateConceptImageFlow',
    inputSchema: GenerateConceptImageInputSchema,
    outputSchema: GenerateConceptImageOutputSchema,
  },
  async ({ description }) => {
    const fullPrompt = `Concept art for: ${description}. Digital painting, high detail, cinematic lighting.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-1.5-pro-latest',
      prompt: fullPrompt,
      output: {
        format: 'image',
      }
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or returned no media.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
