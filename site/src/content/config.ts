import { defineCollection, z } from 'astro:content';

const workouts = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
        duration: z.string(),
        equipment: z.array(z.string()),
        focus: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        publishDate: z.date().or(z.string()).transform((val) => new Date(val)),
    }),
});

const tips = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.string(),
        equipment: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        publishDate: z.date().or(z.string()).transform((val) => new Date(val)),
    }),
});

export const collections = {
    workouts,
    tips,
};
