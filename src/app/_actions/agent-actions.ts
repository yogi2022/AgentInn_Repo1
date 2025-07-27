'use server';

import { z } from 'zod';
import { generateLocalStory } from '@/ai/flows/generate-local-story';
import { generateDifferentiatedWorksheets } from '@/ai/flows/differentiated-worksheet-generator';
import { instantKnowledgeBase } from '@/ai/flows/instant-knowledge-base';
import { generateVisualAid } from '@/ai/flows/visual-aid-generator';

const contentSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  place: z.string().min(3, "Place must be at least 3 characters long."),
  language: z.string(),
  grade: z.number().min(1).max(12),
});

export async function generateStoryAction(prevState: any, formData: FormData) {
  const validatedFields = contentSchema.safeParse({
    topic: formData.get('topic'),
    place: formData.get('place'),
    language: formData.get('language'),
    grade: Number(formData.get('grade')),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateLocalStory(validatedFields.data);
    return { message: 'success', data: result.story };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while generating the story.' };
  }
}

const worksheetSchema = z.object({
  photoDataUri: z.string().min(1, 'Please upload an image.'),
  grades: z.array(z.number()).min(1, 'Please select at least one grade.'),
  language: z.string(),
});

export async function generateWorksheetsAction(values: {
  photoDataUri: string;
  grades: number[];
  language: string;
}) {
  const validatedFields = worksheetSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateDifferentiatedWorksheets(validatedFields.data);
    return { success: true, data: result.worksheets };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred while generating worksheets.' };
  }
}

const knowledgeSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters long."),
  language: z.string(),
});

export async function getKnowledgeAnswerAction(prevState: any, formData: FormData) {
  const validatedFields = knowledgeSchema.safeParse({
    question: formData.get('question'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await instantKnowledgeBase(validatedFields.data);
    return { message: 'success', data: result.answer };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while getting the answer.' };
  }
}

const visualAidSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  language: z.string(),
});

export async function generateVisualAidAction(prevState: any, formData: FormData) {
  const validatedFields = visualAidSchema.safeParse({
    topic: formData.get('topic'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateVisualAid(validatedFields.data);
    return { message: 'success', data: result.diagramDataUri };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while generating the visual aid.' };
  }
}
