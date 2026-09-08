import { describe, expect, it } from 'vitest';
import { paginate } from '../../src/shared/utils/paginate';

describe('paginate', () => {
  it('devuelve skip correcto para página 1', () => {
    expect(paginate(1, 10)).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('devuelve skip correcto para página 3', () => {
    expect(paginate(3, 10)).toEqual({ page: 3, limit: 10, skip: 20 });
  });

  it('corrige page menor a 1', () => {
    expect(paginate(0, 10).page).toBe(1);
    expect(paginate(-5, 10).page).toBe(1);
  });

  it('corrige limit menor a 1', () => {
    expect(paginate(1, 0).limit).toBe(1);
    expect(paginate(1, -3).limit).toBe(1);
  });

  it('limita limit a máximo 100', () => {
    expect(paginate(1, 500).limit).toBe(100);
  });
});