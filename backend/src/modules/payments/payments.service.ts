import stripe from '../../config/stripe';
import prisma from '../../config/database';
import { ApiError } from '../../shared/utils/ApiError';
import { env } from '../../config/env';

const IS_PLACEHOLDER =
  env.STRIPE_SECRET_KEY.includes('placeholder') ||
  env.STRIPE_SECRET_KEY.startsWith('sk_live_placeholder') ||
  env.STRIPE_SECRET_KEY === 'sk_test_placeholder';

export async function createPaymentIntent(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });

  if (!order) throw ApiError.notFound('Order not found');
  if (order.paymentIntentId) throw ApiError.badRequest('Payment already initiated');

  // Modo de prueba: sin llaves Stripe reales
  if (IS_PLACEHOLDER) {
    const mockIntentId = `pi_mock_${order.id}`;
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: mockIntentId },
    });
    return {
      clientSecret: `${mockIntentId}_secret_placeholder`,
      paymentIntentId: mockIntentId,
      mode: 'test' as const,
    };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: 'mxn',
    // 'card' habilita tarjeta + monederos digitales (Apple Pay, Google Pay)
    // de forma transparente cuando el merchant de Stripe está verificado.
    payment_method_types: ['card'],
    metadata: { orderId: order.id, userId },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentIntentId: paymentIntent.id },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    mode: 'live' as const,
  };
}

export async function confirmPayment(userId: string, paymentIntentId: string) {
  // Modo de prueba: cualquier PaymentIntent mock se confirma
  if (paymentIntentId.startsWith('pi_mock_')) {
    const orderId = paymentIntentId.replace('pi_mock_', '');
    await prisma.order.updateMany({
      where: { id: orderId, userId },
      data: { status: 'CONFIRMED' },
    });
    return { status: 'succeeded', paymentIntentId, mode: 'test' as const };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw ApiError.badRequest('Payment not successful');
  }

  return { status: 'succeeded', paymentIntentId, mode: 'live' as const };
}
