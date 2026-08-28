import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Límite de intentos de autenticación: efectivamente ilimitado.
  // Nota: max: 0 bloquearía todas las peticiones; un valor alto lo desactiva.
  max: 1000000,
  message: { success: false, message: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
