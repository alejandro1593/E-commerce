import prisma from '../../config/database';
import { paginate } from '../../shared/utils/paginate';
import { ApiError } from '../../shared/utils/ApiError';

export async function createOrder(userId: string, data: {
  shippingAddress: any;
  paymentIntentId?: string;
}) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true, variant: true },
      },
      coupon: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const price = item.variant ? item.variant.price : item.product.price;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: price,
      total: itemTotal,
    });

    if (item.variant) {
      await prisma.variant.update({
        where: { id: item.variantId! },
        data: { stock: { decrement: item.quantity } },
      });
    } else {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  let discount = 0;
  if (cart.coupon) {
    if (cart.coupon.discountType === 'PERCENTAGE') {
      discount = subtotal * (cart.coupon.discountValue / 100);
    } else {
      discount = Math.min(cart.coupon.discountValue, subtotal);
    }
  }

  const tax = subtotal * 0.16;
  const total = subtotal + tax - discount;

  const order = await prisma.order.create({
    data: {
      userId,
      subtotal,
      tax,
      discount,
      total,
      shippingAddress: data.shippingAddress,
      paymentIntentId: data.paymentIntentId,
      couponId: cart.couponId,
      status: 'CONFIRMED',
      items: { create: orderItems },
    },
    include: {
      items: { include: { product: true, variant: true } },
      coupon: true,
    },
  });

  if (cart.coupon) {
    await prisma.coupon.update({
      where: { id: cart.couponId! },
      data: { usedCount: { increment: 1 } },
    });
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponId: null },
  });

  return order;
}

export async function getUserOrders(userId: string, page: number, limit: number) {
  const { page: p, limit: l, skip } = paginate(page, limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: l,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return { orders, total, page: p, limit: l };
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
      coupon: true,
    },
  });

  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) throw ApiError.notFound('Order not found');
  if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
    throw ApiError.badRequest('Order cannot be cancelled');
  }

  for (const item of order.items) {
    if (item.variantId) {
      await prisma.variant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
    } else {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
    include: { items: true },
  });
}
