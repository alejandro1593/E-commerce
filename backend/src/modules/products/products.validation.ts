import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional(),
  sku: z.string().min(1).max(50),
  stock: z.number().int().min(0).default(0),
  categoryId: z.string().uuid('Invalid category ID'),
  isActive: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    sortOrder: z.number().int().default(0),
  })).optional(),
  variants: z.array(z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().int().min(0).default(0),
    options: z.record(z.string()).optional(),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'oldest']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
});
