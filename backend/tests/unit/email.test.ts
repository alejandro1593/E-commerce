import { describe, expect, it } from 'vitest';
import { passwordResetEmail, orderConfirmationEmail } from '../../src/shared/utils/email';

describe('passwordResetEmail', () => {
  it('genera el asunto correcto', () => {
    expect(passwordResetEmail('http://x.com').subject).toBe('Restablece tu contraseña');
  });

  it('incluye el enlace de restablecimiento en el HTML', () => {
    const html = passwordResetEmail('https://tienda.com/reset?token=abc').html;
    expect(html).toContain('https://tienda.com/reset?token=abc');
  });
});

describe('orderConfirmationEmail', () => {
  it('genera el asunto con el id del pedido', () => {
    expect(orderConfirmationEmail('A123', 500).subject).toBe('Confirmación de pedido #A123');
  });

  it('formatea el total con dos decimales', () => {
    const html = orderConfirmationEmail('A1', 99.9).html;
    expect(html).toContain('$99.90 MXN');
  });
});