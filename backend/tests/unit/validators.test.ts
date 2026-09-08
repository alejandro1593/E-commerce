import { describe, expect, it } from 'vitest';
import { idParamSchema, slugParamSchema } from '../../src/shared/validators/common';

describe('idParamSchema', () => {
  it('acepta un UUID válido', () => {
    const r = idParamSchema.parse({ id: '8b3f4a2e-6d1e-4f6a-9b2e-9b3f4a2e8d10' });
    expect(r.id).toBe('8b3f4a2e-6d1e-4f6a-9b2e-9b3f4a2e8d10');
  });

  it('rechaza un id que no es UUID', () => {
    const r = idParamSchema.safeParse({ id: '123' });
    expect(r.success).toBe(false);
  });
});

describe('slugParamSchema', () => {
  it('acepta un slug no vacío', () => {
    const r = slugParamSchema.parse({ slug: 'camiseta-azul' });
    expect(r.slug).toBe('camiseta-azul');
  });

  it('rechaza un slug vacío', () => {
    const r = slugParamSchema.safeParse({ slug: '' });
    expect(r.success).toBe(false);
  });
});