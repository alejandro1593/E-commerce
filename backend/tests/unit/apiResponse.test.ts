import { describe, expect, it } from 'vitest';
import { ApiResponse } from '../../src/shared/utils/apiResponse';
import { Response } from 'express';

function mockRes() {
  return {
    status: (code: number) => ({
      json: (body: unknown) => ({ code, body }),
      send: () => ({ code }),
    }),
  } as unknown as Response;
}

describe('ApiResponse', () => {
  it('success responde 200 con la estructura esperada', () => {
    const result = ApiResponse.success(mockRes(), { id: 1 }, 'OK') as unknown as {
      code: number;
      body: { success: boolean; message: string; data: { id: number } };
    };
    expect(result.code).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe('OK');
    expect(result.body.data).toEqual({ id: 1 });
  });

  it('created responde 201', () => {
    const result = ApiResponse.created(mockRes(), { id: 2 }) as unknown as { code: number };
    expect(result.code).toBe(201);
  });

  it('paginated construye la paginación correcta', () => {
    const result = ApiResponse.paginated(mockRes(), [{ id: 1 }], 100, 2, 10) as unknown as {
      code: number;
      body: { pagination: { total: number; totalPages: number; hasNext: boolean; hasPrev: boolean } };
    };
    expect(result.code).toBe(200);
    expect(result.body.pagination.totalPages).toBe(10);
    expect(result.body.pagination.hasNext).toBe(true);
    expect(result.body.pagination.hasPrev).toBe(true);
  });

  it('paginated hasNext false en la última página', () => {
    const result = ApiResponse.paginated(mockRes(), [], 10, 2, 10) as unknown as {
      body: { pagination: { hasNext: boolean } };
    };
    expect(result.body.pagination.hasNext).toBe(false);
  });

  it('paginated hasPrev false en la primera página', () => {
    const result = ApiResponse.paginated(mockRes(), [], 10, 1, 10) as unknown as {
      body: { pagination: { hasPrev: boolean } };
    };
    expect(result.body.pagination.hasPrev).toBe(false);
  });

  it('noContent responde 204', () => {
    const result = ApiResponse.noContent(mockRes()) as unknown as { code: number };
    expect(result.code).toBe(204);
  });
});