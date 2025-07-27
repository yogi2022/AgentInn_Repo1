// The file differentiated-worksheet-generator.ts defines a Genkit flow to generate grade-specific worksheets from an uploaded textbook image.

'use server';

/**
 * @fileOverview A differentiated worksheet generator AI agent.
 *
 * - generateDifferentiatedWorksheets - A function that handles the worksheet generation process.
 * - DifferentiatedWorksheetInput - The input type for the generateDifferentiatedWorksheets function.
 * - DifferentiatedWorksheetOutput - The return type for the generateDifferentiatedWorksheets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DifferentiatedWorksheetInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a textbook page, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  grades: z.array(z.number()).describe('The grade levels for which to generate worksheets.'),
  language: z.string().describe('The language in which to generate the worksheets.'),
});
export type DifferentiatedWorksheetInput = z.infer<typeof DifferentiatedWorksheetInputSchema>;

const DifferentiatedWorksheetOutputSchema = z.object({
  worksheets: z.array(
    z.object({
      grade: z.number().describe('The grade level of the worksheet.'),
      worksheetContent: z.string().describe('The content of the generated worksheet.'),
    })
  ).
describe('The generated worksheets for each grade level.'),
});
export type DifferentiatedWorksheetOutput = z.infer<typeof DifferentiatedWorksheetOutputSchema>;

export async function generateDifferentiatedWorksheets(
  input: DifferentiatedWorksheetInput
): Promise<DifferentiatedWorksheetOutput> {
  return differentiatedWorksheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'differentiatedWorksheetPrompt',
  input: {schema: DifferentiatedWorksheetInputSchema},
  output: {schema: DifferentiatedWorksheetOutputSchema},
  prompt: `You are an expert educator specializing in creating differentiated learning materials.

  Given a textbook page and a list of grade levels, you will generate a worksheet for each grade level that is tailored to the content of the textbook page and appropriate for the grade level.

  Use the following textbook page as the primary source of information for generating the worksheets:

  Textbook Page Photo: {{media url=photoDataUri}}

  Generate worksheets for the following grade levels: {{{grades}}}

  The worksheets should be in the following language: {{{language}}}

  Return the worksheets in the following JSON format:
  {
    "worksheets": [
      {
        "grade": <grade_level>,
        "worksheetContent": <worksheet_content>
      },
      ...
    ]
  }
`,
});

const differentiatedWorksheetFlow = ai.defineFlow(
  {
    name: 'differentiatedWorksheetFlow',
    inputSchema: DifferentiatedWorksheetInputSchema,
    outputSchema: DifferentiatedWorksheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
