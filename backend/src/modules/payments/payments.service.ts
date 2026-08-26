import stripe from '../../config/stripe';
import prisma from '../../config/database';
import { ApiError } from '../../shared/utils/ApiError';

export async function createPaymentIntent(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });

  if (!order) throw ApiError.notFound('Order not found');
  if (order.paymentIntentId) throw ApiError.badRequest('Payment already initiated');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: 'mxn',
    metadata: { orderId: order.id, userId },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentIntentId: paymentIntent.id },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

export async function confirmPayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw ApiError.badRequest('Payment not successful');
  }

  return { status: 'succeeded', paymentIntentId };
}
