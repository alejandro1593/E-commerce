import { describe, expect, it } from 'vitest';
import { slugify } from '../../src/shared/utils/slugify';

describe('slugify', () => {
  it('convierte texto a minúsculas', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('reemplaza espacios y acentos', () => {
    expect(slugify('Camiseta  Azul')).toBe('camiseta-azul');
  });

  it('elimina caracteres especiales', () => {
    expect(slugify('Zapatos!! (running)')).toBe('zapatos-running');
  });

  it('elimina guiones duplicados', () => {
    expect(slugify('a   b    c')).toBe('a-b-c');
  });

  it('quita guiones al inicio y final', () => {
    expect(slugify('-hola-')).toBe('hola');
  });

  it('maneja strings vacíos', () => {
    expect(slugify('')).toBe('');
  });

  it('maneja valores numéricos vía toString', () => {
    expect(slugify(String(123))).toBe('123');
  });
});