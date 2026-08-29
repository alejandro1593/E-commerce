import { Request, Response } from 'express';
import stripe from '../../config/stripe';
import prisma from '../../config/database';
import { sendEmail, orderConfirmationEmail } from '../../shared/utils/email';
import { restockOrderItems } from '../orders/orders.service';

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        const existing = await prisma.order.findUnique({
          where: { id: orderId },
          select: { status: true },
        });

        if (!existing || existing.status === 'CONFIRMED') {
          break;
        }

        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
          include: { user: true },
        });

        const emailContent = orderConfirmationEmail(order.id, order.total);
        await sendEmail({ to: order.user.email, ...emailContent });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        const existing = await prisma.order.findUnique({
          where: { id: orderId },
          select: { status: true },
        });

        if (!existing || existing.status !== 'PENDING') {
          break;
        }

        await prisma.$transaction(async (tx) => {
          await restockOrderItems(tx, orderId);
          await tx.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
          });
        });
      }
      break;
    }
  }

  res.json({ received: true });
}
