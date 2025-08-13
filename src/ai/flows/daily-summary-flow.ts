
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
import type {Task} from '@/types/task';
const wav = require('wav');

const DailySummaryInputSchema = z.object({
  tasks: z.array(z.object({
    id: z.string(),
    customerName: z.string(),
    description: z.string(),
    status: z.enum(['Proses Desain', 'Proses ACC', 'Selesai']),
    source: z.enum(['N', 'CS', 'Admin', 'G']),
    dueDate: z.string().optional(),
  })).describe('An array of active tasks to be summarized.'),
});
export type DailySummaryInput = z.infer<typeof DailySummaryInputSchema>;

const DailySummaryOutputSchema = z.object({
  audioUri: z.string().describe('The audio data URI of the daily summary.'),
  transcript: z.string().describe('The full text transcript of the summary.'),
});
export type DailySummaryOutput = z.infer<typeof DailySummaryOutputSchema>;

export async function dailySummary(input: DailySummaryInput): Promise<DailySummaryOutput> {
  return dailySummaryFlow(input);
}

const summaryPrompt = ai.definePrompt({
  name: 'summaryPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {
    schema: z.object({
      tasks: z.array(z.any()).describe('Array of active tasks'),
      taskCount: z.number(),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A conversational script for the daily summary.'),
    }),
  },
  prompt: `You are tasked with creating a daily summary script for a user. The summary should be a conversation between two personas: a "Manager" and an "Asisten". The conversation must be in Indonesian.

    **Personas:**
    - **Manager**: Formal, direct, focuses on the facts (what the task is, customer, due date).
    - **Asisten**: Enthusiastic, encouraging, provides creative context or motivation.

    **Instructions:**
    1.  Start with a greeting from the Manager.
    2.  The Manager states the total number of active tasks ({{taskCount}}).
    3.  Go through each task. The Manager should state the core details, and the Asisten should follow up with an encouraging or contextual comment.
    4.  The output MUST be a script formatted with "Speaker: Text". Use "Manager" and "Asisten" as the speaker names.
    5.  Do not add any other text, just the script.

    **Example for one task:**
    Manager: Selamat pagi. Hari ini ada 1 tugas aktif. Tugas pertama untuk Rinan Corp, yaitu desain ulang spanduk, jatuh tempo besok.
    Asisten: Semangat! Ini kesempatan bagus untuk menunjukkan kreativitas kita pada Rinan Corp. Mari kita buat spanduk yang paling menarik!

    ---
    **Active Tasks Data:**
    {{#each tasks}}
      - Customer: {{this.customerName}}, Description: {{this.description}}, Status: {{this.status}}, Due Date: {{this.dueDate}}
    {{/each}}
    ---
    
    Now, generate the full script based on the provided tasks.
    `
});

const dailySummaryFlow = ai.defineFlow(
  {
    name: 'dailySummaryFlow',
    inputSchema: DailySummaryInputSchema,
    outputSchema: DailySummaryOutputSchema,
  },
  async ({ tasks }) => {
    const noTasksSummary = `
Manager: Selamat pagi. Apakah ada tugas yang perlu kita periksa hari ini?
Asisten: Selamat pagi! Sepertinya semua tugas sudah selesai. Hari ini kita bisa sedikit bersantai!
    `.trim();
    // If there are no tasks, return a simple message.
    const summaryText = tasks.length > 0 
      ? (await summaryPrompt({ tasks, taskCount: tasks.length })).output?.summary
      : noTasksSummary;

    if (!summaryText) {
      throw new Error('Failed to generate summary.');
    }

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts-001',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'Manager',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Algenib' },
                  },
                },
                {
                  speaker: 'Asisten',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Achernar' },
                  },
                },
              ],
            },
          },
        },
        prompt: summaryText,
      });

      if (!media) {
        throw new Error('no media returned');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

    return {
      audioUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
      transcript: summaryText,
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
    writer.on('data', function (d: any) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
