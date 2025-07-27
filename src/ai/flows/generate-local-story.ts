'use server';

/**
 * @fileOverview A hyper-local content generation AI agent.
 *
 * - generateLocalStory - A function that handles the story generation process.
 * - GenerateLocalStoryInput - The input type for the generateLocalStory function.
 * - GenerateLocalStoryOutput - The return type for the generateLocalStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocalStoryInputSchema = z.object({
  language: z
    .string()
    .describe('The language in which the story should be generated.'),
  topic: z.string().describe('The topic of the story.'),
  place: z.string().describe('The place where the story is set.'),
  grade: z.number().describe('The grade level for which the story is intended.'),
});
export type GenerateLocalStoryInput = z.infer<typeof GenerateLocalStoryInputSchema>;

const GenerateLocalStoryOutputSchema = z.object({
  story: z.string().describe('The generated story.'),
});
export type GenerateLocalStoryOutput = z.infer<typeof GenerateLocalStoryOutputSchema>;

export async function generateLocalStory(input: GenerateLocalStoryInput): Promise<GenerateLocalStoryOutput> {
  return generateLocalStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocalStoryPrompt',
  input: {schema: GenerateLocalStoryInputSchema},
  output: {schema: GenerateLocalStoryOutputSchema},
  prompt: `You are Sahayak Content Agent. Produce culturally relevant stories for grade {{grade}}.
Write in {{language}} using simple sentences. Keep each paragraph <=3 lines.

Create a 250-word story set in {{place}} about {{topic}}.`,
});

const generateLocalStoryFlow = ai.defineFlow(
  {
    name: 'generateLocalStoryFlow',
    inputSchema: GenerateLocalStoryInputSchema,
    outputSchema: GenerateLocalStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
