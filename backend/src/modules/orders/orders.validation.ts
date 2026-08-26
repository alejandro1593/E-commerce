import { z } from 'zod';

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1).default('MX'),
  }),
  paymentIntentId: z.string().optional(),
});
