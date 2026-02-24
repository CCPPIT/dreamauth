import { z } from 'zod';

export const userSchema = z.object({
  sleepHours: z.number().min(0).max(24).optional(),
  personality: z.enum(['single', 'married', 'family']).optional(),
});

export const roomSchema = z.object({
  color: z.string().min(1),
  woodType: z.string().min(1),
  price: z.number().positive(),
});
