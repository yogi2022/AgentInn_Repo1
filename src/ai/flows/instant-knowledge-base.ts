'use server';

/**
 * @fileOverview Provides simple, accurate explanations for complex student questions in the local language, using easy-to-understand analogies.
 *
 * - instantKnowledgeBase - A function that provides simple, accurate explanations for complex student questions.
 * - InstantKnowledgeBaseInput - The input type for the instantKnowledgeBase function.
 * - InstantKnowledgeBaseOutput - The return type for the instantKnowledgeBase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InstantKnowledgeBaseInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  language: z.string().describe('The language in which the answer should be provided. Example: hi for Hindi'),
});
export type InstantKnowledgeBaseInput = z.infer<typeof InstantKnowledgeBaseInputSchema>;

const InstantKnowledgeBaseOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, explained in simple terms with analogies.'),
});
export type InstantKnowledgeBaseOutput = z.infer<typeof InstantKnowledgeBaseOutputSchema>;

export async function instantKnowledgeBase(input: InstantKnowledgeBaseInput): Promise<InstantKnowledgeBaseOutput> {
  return instantKnowledgeBaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'instantKnowledgeBasePrompt',
  input: {schema: InstantKnowledgeBaseInputSchema},
  output: {schema: InstantKnowledgeBaseOutputSchema},
  prompt: `Explain the following question to a student in simple terms, using easy-to-understand analogies, in the given language.

Question: {{{question}}}
Language: {{{language}}}

Answer:`,
});

const instantKnowledgeBaseFlow = ai.defineFlow(
  {
    name: 'instantKnowledgeBaseFlow',
    inputSchema: InstantKnowledgeBaseInputSchema,
    outputSchema: InstantKnowledgeBaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
