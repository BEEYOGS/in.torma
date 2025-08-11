
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
    // A more descriptive prompt for better results.
    const textPrompt = `Generate a high-quality, photorealistic concept art image based on the following description: "${description}". The image should have cinematic lighting, high detail, and a professional digital painting style.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: textPrompt,
      config: {
        // According to documentation, both 'TEXT' and 'IMAGE' are required for this model.
        responseModalities: ['TEXT', 'IMAGE'],
        // Relax safety settings to reduce chances of blocking harmless prompts.
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
           {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
        ]
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
