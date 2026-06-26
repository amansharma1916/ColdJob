import { z } from 'zod';

export const sendEmailSchema = z.object({
  body: z
    .object({
      recipientEmail: z.string().email().optional().nullable(),
      contactId: z.string().optional().nullable(),
      templateId: z.string().optional().nullable(),
      resumeId: z.string().optional().nullable(),
      subject: z.string().min(3).max(200),
      body: z.string().min(10),
      extraPlaceholders: z.record(z.string()).optional().nullable(),
    })
    .refine((d) => d.recipientEmail || d.contactId, {
      message: 'Either recipientEmail or contactId is required',
    }),
});

export const sendBulkEmailSchema = z.object({
  body: z.object({
    contactIds: z.array(z.string()).optional().nullable(),
    manualEmails: z.array(z.string().email()).optional().nullable(),
    templateId: z.string().optional().nullable(),
    resumeId: z.string().optional().nullable(),
    subject: z.string().min(3).max(200),
    body: z.string().min(10),
    extraPlaceholders: z.record(z.string()).optional().nullable(),
    delayMs: z.coerce.number().int().positive().default(1000).optional(),
  }).refine((d) => (d.contactIds && d.contactIds.length > 0) || (d.manualEmails && d.manualEmails.length > 0), {
    message: 'Either contactIds or manualEmails is required',
  }),
});

export const previewEmailSchema = z.object({
  body: z.object({
    templateId: z.string().optional().nullable(),
    contactId: z.string().optional(),
    recipientEmail: z.string().email().optional(),
    extraPlaceholders: z.record(z.string()).optional(),
  }),
});

export const createScheduledEmailSchema = z.object({
  body: z.object({
    recipientEmail: z.string().email().optional().nullable(),
    contactId: z.string().optional().nullable(),
    templateId: z.string().optional().nullable(),
    resumeId: z.string().optional().nullable(),
    subject: z.string().min(3).max(200),
    body: z.string().min(10),
    extraPlaceholders: z.record(z.string()).optional().nullable(),
    scheduledTime: z.coerce.date().refine((date) => date > new Date(), {
      message: 'Scheduled time must be in the future',
    }),
  }).refine((d) => d.recipientEmail || d.contactId, {
    message: 'Either recipientEmail or contactId is required',
  }),
});