import nodemailer from 'nodemailer';
import { env } from '../../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.NODE_ENV === 'production',
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
    : undefined,
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (env.NODE_ENV === 'test') return;

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log(`📧 Email sent to ${options.to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export function passwordResetEmail(resetUrl: string): { subject: string; html: string } {
  return {
    subject: 'Restablece tu contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Restablece tu contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #00d4ff; color: #000; padding: 12px 24px;
                  text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
          Restablecer contraseña
        </a>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora.</p>
        <p style="color: #666; font-size: 14px;">Si no solicitaste esto, ignora este email.</p>
      </div>
    `,
  };
}

export function orderConfirmationEmail(orderId: string, total: number): { subject: string; html: string } {
  return {
    subject: `Confirmación de pedido #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>¡Pedido confirmado!</h2>
        <p>Tu pedido <strong>#${orderId}</strong> ha sido recibido.</p>
        <p><strong>Total: $${total.toFixed(2)} MXN</strong></p>
        <p>Te notificaremos cuando tu pedido sea enviado.</p>
      </div>
    `,
  };
}
