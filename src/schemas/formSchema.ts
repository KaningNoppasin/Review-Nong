import { z } from 'zod';

export const formSchema = z.object({
    className: z.string().min(1).max(40),
    date: z.coerce.date(),
    username: z.string().min(1).max(20),
    topic: z.string().min(1).min(0).max(300),
    reviewNong: z.string().min(1).min(0).max(500),
});
