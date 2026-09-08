import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/shared/utils/ApiError';

describe('ApiError', () => {
  it('crea una instancia con los valores por defecto', () => {
    const err = new ApiError('Algo salió mal');
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Algo salió mal');
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(true);
  });

  it('acepta statusCode e isOperational personalizados', () => {
    const err = new ApiError('No encontrado', 404, false);
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(false);
  });

  it('preserva el prototype correcto', () => {
    const err = new ApiError('x');
    expect(Object.getPrototypeOf(err)).toBe(ApiError.prototype);
  });

  it('badRequest devuelve 400', () => {
    const err = ApiError.badRequest();
    expect(err.statusCode).toBe(400);
    expect(err.isOperational).toBe(true);
  });

  it('unauthorized devuelve 401', () => {
    expect(ApiError.unauthorized().statusCode).toBe(401);
  });

  it('forbidden devuelve 403', () => {
    expect(ApiError.forbidden().statusCode).toBe(403);
  });

  it('notFound devuelve 404', () => {
    expect(ApiError.notFound().statusCode).toBe(404);
  });

  it('conflict devuelve 409', () => {
    expect(ApiError.conflict().statusCode).toBe(409);
  });

  it('tooMany devuelve 429', () => {
    expect(ApiError.tooMany().statusCode).toBe(429);
  });

  it('internal devuelve 500 y es no operacional', () => {
    const err = ApiError.internal();
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(false);
  });

  it('acepta mensajes personalizados', () => {
    expect(ApiError.notFound('Usuario no existe').message).toBe('Usuario no existe');
  });
});