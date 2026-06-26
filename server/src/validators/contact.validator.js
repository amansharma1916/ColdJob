import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(200),
    lastName: z.string().max(200).optional(),
    email: z.string().email(),
    company: z.string().max(200).optional(),
    role: z.string().max(200).optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(200).optional(),
    lastName: z.string().max(200).optional(),
    email: z.string().email().optional(),
    company: z.string().max(200).optional(),
    role: z.string().max(200).optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const contactIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});