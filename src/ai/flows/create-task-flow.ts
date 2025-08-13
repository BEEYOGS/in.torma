'use server';

/**
 * @fileOverview An AI agent for creating tasks from natural language input or answering general questions.
 *
 * - createTask - A function that handles the task creation process.
 * - CreateTaskInput - The input type for the createTask function.
 * - CreateTaskOutput - The return type for the createTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {webSearch} from '@/ai/tools/web-search-tool';

const CreateTaskInputSchema = z.object({
  userInput: z
    .string()
    .describe("The user's input in natural language, which could be a task creation request or a general question."),
});
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

const CreateTaskOutputSchema = z.object({
  isTask: z.boolean().describe('Whether the user input is a task creation request.'),
  taskDetails: z
    .object({
      customerName: z.string().optional().describe('The name of the customer for the task.'),
      description: z.string().optional().describe('A brief description of the task.'),
      dueDate: z.string().optional().describe('The due date for the task in ISO format (YYYY-MM-DD).'),
    })
    .optional()
    .describe('Details of the task if the user input is a task creation request.'),
  answer: z.string().optional().describe('The answer to the general question if the user input is a question.'),
});
export type CreateTaskOutput = z.infer<typeof CreateTaskOutputSchema>;

export async function createTask(input: CreateTaskInput): Promise<CreateTaskOutput> {
  return createTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createTaskPrompt',
  input: {schema: CreateTaskInputSchema.extend({
    currentDate: z.string(),
    tomorrow: z.string(),
    dayAfterTomorrow: z.string(),
    nextWeek: z.string(),
  })},
  output: {schema: CreateTaskOutputSchema},
  tools: [webSearch],
  prompt: `You are a highly intelligent project manager's assistant for a task management app called "in.torma".
Your primary function is to process a user's natural language input and determine if it's a request to create a task or a general question.

Follow these steps carefully:
1.  **Analyze the User's Intent**: Read the user's input to determine if they want to create a task or ask a question.
    - Task requests usually involve actions, customer names, and deadlines.
    - Questions are general queries that might require external knowledge.

2.  **If it's a Task Request**:
    - Set the 'isTask' field to 'true'.
    - Extract the following details for the 'taskDetails' object:
        - **customerName**: The name of the person or company the task is for.
        - **description**: A clear and concise summary of what needs to be done.
        - **dueDate**: The deadline for the task.
    - **Date Handling**: You MUST convert relative dates into a strict 'YYYY-MM-DD' format.
        - Today's date is {{currentDate}}.
        - "besok" -> {{tomorrow}}.
        - "lusa" -> {{dayAfterTomorrow}}.
        - "minggu depan" -> {{nextWeek}}.
        - "3 hari lagi" -> Calculate 3 days from {{currentDate}}.
    - Do NOT use the webSearch tool for task requests.

3.  **If it's a General Question**:
    - Set the 'isTask' field to 'false'.
    - Use the 'webSearch' tool to find a reliable answer.
    - Place the answer in the 'answer' field.
    - Leave 'taskDetails' empty.

**Examples:**

*   **User Input**: "buatkan tugas untuk Rinan Corp, desain ulang spanduk, deadline besok"
*   **Your JSON Output**:
    \`\`\`json
    {
      "isTask": true,
      "taskDetails": {
        "customerName": "Rinan Corp",
        "description": "Desain ulang spanduk",
        "dueDate": "{{tomorrow}}"
      }
    }
    \`\`\`

*   **User Input**: "Tolong ingatkan saya untuk follow up PT Sejahtera lusa."
*   **Your JSON Output**:
    \`\`\`json
    {
      "isTask": true,
      "taskDetails": {
        "customerName": "PT Sejahtera",
        "description": "Follow up PT Sejahtera",
        "dueDate": "{{dayAfterTomorrow}}"
      }
    }
    \`\`\`

*   **User Input**: "apa itu genkit?"
*   **Your JSON Output**: (After calling webSearch tool)
    \`\`\`json
    {
      "isTask": false,
      "answer": "Genkit is an open source framework from Google to build production-ready AI-powered applications."
    }
    \`\`\`

---
**Current User Input**: {{{userInput}}}
---
`,
});

const createTaskFlow = ai.defineFlow(
  {
    name: 'createTaskFlow',
    inputSchema: CreateTaskInputSchema,
    outputSchema: CreateTaskOutputSchema,
  },
  async (input) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(now.getDate() + 2);
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const {output} = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: prompt,
      input: {
        ...input,
        currentDate: formatDate(now),
        tomorrow: formatDate(tomorrow),
        dayAfterTomorrow: formatDate(dayAfterTomorrow),
        nextWeek: formatDate(nextWeek),
      },
    });

    if (!output) {
      throw new Error("AI did not produce a valid output.");
    }
    
    return output;
  }
);
