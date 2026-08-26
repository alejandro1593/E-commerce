import prisma from '../../config/database';
import { ApiError } from '../../shared/utils/ApiError';

async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
          },
          variant: true,
        },
      },
      coupon: true,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
            },
            variant: true,
          },
        },
        coupon: true,
      },
    });
  }

  return cart;
}

function calculateCartTotal(cart: any) {
  let subtotal = 0;
  for (const item of cart.items) {
    const price = item.variant ? item.variant.price : item.product.price;
    subtotal += price * item.quantity;
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

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount: cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
  };
}

export async function getCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  const totals = calculateCartTotal(cart);
  return { ...cart, ...totals };
}

export async function addItem(userId: string, data: { productId: string; variantId?: string; quantity: number }) {
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');

  if (data.variantId) {
    const variant = await prisma.variant.findUnique({ where: { id: data.variantId } });
    if (!variant) throw ApiError.notFound('Variant not found');
    if (variant.stock < data.quantity) throw ApiError.badRequest('Insufficient stock');
  } else {
    if (product.stock < data.quantity) throw ApiError.badRequest('Insufficient stock');
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item: any) => item.productId === data.productId && item.variantId === (data.variantId || null)
  );

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + data.quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: data.productId,
        variantId: data.variantId || null,
        quantity: data.quantity,
      },
    });
  }

  return getCart(userId);
}

export async function updateCartItem(userId: string, itemId: string, quantity: number) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i: any) => i.id === itemId);

  if (!item) throw ApiError.notFound('Cart item not found');

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return getCart(userId);
}

export async function removeCartItem(userId: string, itemId: string) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i: any) => i.id === itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
}

export async function clearCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponId: null },
  });
  return getCart(userId);
}

export async function applyCoupon(userId: string, code: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) throw ApiError.notFound('Invalid coupon');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw ApiError.badRequest('Coupon expired');
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw ApiError.badRequest('Coupon usage limit reached');

  const cart = await getOrCreateCart(userId);

  if (cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

  const totals = calculateCartTotal({ ...cart, coupon });
  if (coupon.minPurchase > 0 && totals.subtotal < coupon.minPurchase) {
    throw ApiError.badRequest(`Minimum purchase of $${coupon.minPurchase} required`);
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponId: coupon.id },
  });

  return getCart(userId);
}

export async function removeCoupon(userId: string) {
  const cart = await getOrCreateCart(userId);
  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponId: null },
  });
  return getCart(userId);
}
