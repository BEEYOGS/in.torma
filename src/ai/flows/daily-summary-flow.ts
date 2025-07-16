'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a daily audio summary of active tasks.
 *
 * - dailySummary - A function that generates a daily audio summary.
 * - DailySummaryInput - The input type for the dailySummary function.
 * - DailySummaryOutput - The return type for the dailySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getTasks } from '@/services/task-service';
import {Task} from '@/types/task';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

const DailySummaryInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting the summary.'),
});
export type DailySummaryInput = z.infer<typeof DailySummaryInputSchema>;

const DailySummaryOutputSchema = z.object({
  media: z.string().describe('The audio data URI of the daily summary.'),
});
export type DailySummaryOutput = z.infer<typeof DailySummaryOutputSchema>;

export async function dailySummary(input: DailySummaryInput): Promise<DailySummaryOutput> {
  return dailySummaryFlow(input);
}

const summaryPrompt = ai.definePrompt({
  name: 'summaryPrompt',
  input: {
    schema: z.object({
      tasks: z.array(z.any()).describe('Array of active tasks'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of active tasks.'),
    }),
  },
  prompt: `You are tasked with creating a daily summary of active tasks for a user.

    Given the following tasks:
    {{#each tasks}}
      - Customer: {{this.customerName}}, Description: {{this.description}}, Status: {{this.designStatus}}, Source: {{this.taskSource}}, Due Date: {{this.dueDate}}
    {{/each}}

    Create a brief and informative summary that the user can listen to.
    `
});

const ttsPrompt = ai.definePrompt({
  name: 'ttsPrompt',
  input: {
    schema: z.object({
      summary: z.string().describe('The summary text to convert to speech.'),
    }),
  },
  output: {
    schema: z.object({
      media: z.string().describe('The audio data URI of the summary.'),
    }),
  },
  prompt: `Convert the following summary to audio:
    {{summary}}`,
});


const dailySummaryFlow = ai.defineFlow(
  {
    name: 'dailySummaryFlow',
    inputSchema: DailySummaryInputSchema,
    outputSchema: DailySummaryOutputSchema,
  },
  async input => {
    // 1. Fetch active tasks from Firestore
    const tasks = await getTasks();

    // 2. Generate a summary script using the summaryPrompt
    const { output: summaryOutput } = await summaryPrompt({
      tasks: tasks,
    });

    if (!summaryOutput?.summary) {
      throw new Error('Failed to generate summary.');
    }

    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: summaryOutput.summary,
      });
      if (!media) {
        throw new Error('no media returned');
      }
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
