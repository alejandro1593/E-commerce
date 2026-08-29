import prisma from '../../config/database';
import { ApiError } from '../../shared/utils/ApiError';
import bcrypt from 'bcryptjs';

function sanitizeUser(user: any) {
  const { password, ...rest } = user;
  return rest;
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');
  return sanitizeUser(user);
}

export async function updateProfile(userId: string, data: { name?: string; phone?: string; avatar?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return sanitizeUser(user);
}

export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  });
}

export async function createAddress(userId: string, data: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}) {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: { ...data, userId },
  });
}

export async function updateAddress(userId: string, addressId: string, data: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) throw ApiError.notFound('Address not found');

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
}

export async function deleteAddress(userId: string, addressId: string) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) throw ApiError.notFound('Address not found');

  await prisma.address.delete({ where: { id: addressId } });
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}
