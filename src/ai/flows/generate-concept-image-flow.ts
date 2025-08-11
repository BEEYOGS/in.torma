
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
    // Create a simple, direct text prompt for the image generation model.
    const textPrompt = `A digital painting of concept art for: ${description}, high detail, cinematic lighting.`;

    const {media} = await ai.generate({
      // IMPORTANT: Use the correct model for image generation.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      // The prompt should be a simple string.
      prompt: textPrompt,
      config: {
        // According to the latest documentation, this model requires both TEXT and IMAGE.
        // Even if we only expect an image, this configuration is necessary.
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or returned no media.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
