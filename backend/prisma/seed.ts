import { PrismaClient, Role, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@ecommerce.com' },
    update: {},
    create: {
      email: 'user@ecommerce.com',
      password: userPassword,
      name: 'Juan Perez',
      role: Role.USER,
    },
  });

  await prisma.cart.create({ data: { userId: admin.id } });
  await prisma.cart.create({ data: { userId: user.id } });

  const electronics = await prisma.category.upsert({
    where: { slug: 'electronica' },
    update: {},
    create: { name: 'Electrónica', slug: 'electronica', description: 'Dispositivos electrónicos y gadgets' },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'ropa' },
    update: {},
    create: { name: 'Ropa', slug: 'ropa', description: 'Ropa y accesorios de moda' },
  });

  const home = await prisma.category.upsert({
    where: { slug: 'hogar' },
    update: {},
    create: { name: 'Hogar', slug: 'hogar', description: 'Artículos para el hogar' },
  });

  const products = [
    {
      name: 'Laptop Pro 15"',
      slug: 'laptop-pro-15',
      description: 'Laptop de alta memoria con procesador de última generación. Perfecta para profesionales y creadores de contenido.',
      price: 25999,
      compareAtPrice: 29999,
      sku: 'LAP-001',
      stock: 25,
      categoryId: electronics.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', alt: 'Laptop Pro 15' },
      ],
    },
    {
      name: 'Auriculares Bluetooth',
      slug: 'auriculares-bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido activa y 30 horas de batería.',
      price: 1899,
      compareAtPrice: 2499,
      sku: 'AUD-001',
      stock: 100,
      categoryId: electronics.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Auriculares BT' },
      ],
    },
    {
      name: 'Camiseta Premium',
      slug: 'camiseta-premium',
      description: 'Camiseta de algodón orgánico 100%, corte moderno y cómodo. Disponible en varios colores.',
      price: 499,
      sku: 'CAM-001',
      stock: 200,
      categoryId: clothing.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt: 'Camiseta Premium' },
      ],
      variants: [
        { name: 'Negra - M', sku: 'CAM-001-NM', price: 499, stock: 50, options: { color: 'Negro', size: 'M' } },
        { name: 'Negra - L', sku: 'CAM-001-NL', price: 499, stock: 50, options: { color: 'Negro', size: 'L' } },
        { name: 'Blanca - M', sku: 'CAM-001-BM', price: 499, stock: 50, options: { color: 'Blanco', size: 'M' } },
        { name: 'Blanca - L', sku: 'CAM-001-BL', price: 499, stock: 50, options: { color: 'Blanco', size: 'L' } },
      ],
    },
    {
      name: 'Lámpara LED de Escritorio',
      slug: 'lampara-led-escritorio',
      description: 'Lámpara LED inteligente con control de temperatura de color y brillo ajustable.',
      price: 899,
      compareAtPrice: 1199,
      sku: 'LAMP-001',
      stock: 75,
      categoryId: home.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab788?w=800', alt: 'Lámpara LED' },
      ],
    },
    {
      name: 'Smartwatch Ultra',
      slug: 'smartwatch-ultra',
      description: 'Reloj inteligente con GPS, monitoreo de salud, resistente al agua hasta 50m.',
      price: 4999,
      compareAtPrice: 5999,
      sku: 'SW-001',
      stock: 30,
      categoryId: electronics.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', alt: 'Smartwatch Ultra' },
      ],
    },
    {
      name: 'Mochila Urban',
      slug: 'mochila-urban',
      description: 'Mochila resistente al agua con compartimento para laptop de 15". Diseño moderno y funcional.',
      price: 799,
      sku: 'MOCH-001',
      stock: 60,
      categoryId: clothing.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt: 'Mochila Urban' },
      ],
    },
  ];

  for (const productData of products) {
    const { images, variants, ...data } = productData;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        images: images ? { create: images } : undefined,
        variants: variants ? { create: variants } : undefined,
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'BIENVENIDO10' },
    update: {},
    create: {
      code: 'BIENVENIDO10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minPurchase: 500,
      maxUses: 100,
      expiresAt: new Date('2026-12-31'),
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'AHORRO50' },
    update: {},
    create: {
      code: 'AHORRO50',
      discountType: DiscountType.FIXED,
      discountValue: 50,
      minPurchase: 300,
      maxUses: 200,
    },
  });

  console.log('✅ Seed completed!');
  console.log('   Admin: admin@ecommerce.com / Admin123!');
  console.log('   User:  user@ecommerce.com / User123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
