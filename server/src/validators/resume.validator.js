import { z } from 'zod';

export const updateResumeSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(['resume', 'cover_letter', 'certificate', 'portfolio']).optional(),
  }),
});

export const resumeIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});