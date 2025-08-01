import { config } from 'dotenv';
config();

import '@/ai/flows/create-task-flow.ts';
import '@/ai/flows/daily-summary-flow.ts';
import '@/ai/flows/tts-flow.ts';
import '@/ai/flows/generate-concept-image-flow.ts';
