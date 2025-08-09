# **App Name**: KerjaSini: Collaborative Task Board

## Core Features:

- Task Board: Kanban board with drag-and-drop functionality to manage tasks across 'Proses Desain', 'Menunggu Konfirmasi', and 'Selesai' columns, with automatic Firestore status updates.
- Task Cards: Interactive task cards displaying customer name, brief description, and due date, with hover effects and dropdown menus for editing and deletion.
- Task Management Dialog: ShadCN UI dialog modal for adding new tasks and editing existing ones, including fields for Customer Name, Description, Design Status, Task Source, and Due Date.
- AI Task Creator: AI Assistant dialog to interpret natural language input, using a Genkit flow to differentiate between task creation requests (parsing details and pre-filling the form) and general questions (using a web search tool to provide answers).
- Daily Audio Summary: Daily briefing feature that leverages Genkit to create a summary script of active tasks, converts it to audio using text-to-speech, and plays it in the browser.
- Analytics Dashboard: Interactive dashboard with analytics presented via Recharts, displaying a bar graph of completed tasks per day over the last 7 days and a pie chart illustrating task distribution by source.

## Style Guidelines:

- Primary color: Deep purple (#624CAB) for a professional and engaging feel, suggesting both creativity and reliability.
- Background color: Dark gray (#222222) to provide a modern, sophisticated backdrop that enhances contrast and readability, slightly desaturated purple (20% saturation).
- Accent color: Blue-violet (#8758FF), a brighter tone, to draw the eye to important interactive elements.
- Body font: 'Inter', a grotesque-style sans-serif, for a clean, neutral, modern look.
- Headline font: 'Space Grotesk', a sans-serif font, is suitable for headlines
- Modern, minimalist icons to represent task sources and statuses.
- Clean, well-spaced layout to ensure readability and ease of use.