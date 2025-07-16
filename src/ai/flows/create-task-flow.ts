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
  input: {schema: CreateTaskInputSchema},
  output: {schema: CreateTaskOutputSchema},
  tools: [webSearch],
  prompt: `You are an AI assistant that can create tasks from natural language input or answer general questions.

  If the user input is a task creation request, extract the task details (customer name, description, due date) and set the isTask field to true.
  If the user input is a general question, use the webSearch tool to find the answer and set the isTask field to false.

  User Input: {{{userInput}}}

  Respond in JSON format.`,
});

const createTaskFlow = ai.defineFlow(
  {
    name: 'createTaskFlow',
    inputSchema: CreateTaskInputSchema,
    outputSchema: CreateTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
