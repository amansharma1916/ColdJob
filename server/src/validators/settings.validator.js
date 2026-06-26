import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    dailyLimit: z.coerce.number().int().positive().max(500).optional(),
    defaultFromName: z.string().max(200).optional(),
    signature: z.string().optional(),
    trackOpens: z.boolean().optional(),
    trackClicks: z.boolean().optional(),
    replyTo: z.string().email().optional().or(z.literal('')),
    unsubscribeText: z.string().optional(),
  }),
});