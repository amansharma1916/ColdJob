import { z } from 'zod';

export const createTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    subject: z.string().min(1).max(500),
    body: z.string().min(1),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    subject: z.string().min(1).max(500).optional(),
    body: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const templateIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const previewTemplateSchema = z.object({
  body: z.object({
    templateId: z.string().min(1),
    placeholders: z.record(z.string()).optional(),
  }),
});