import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { generalLimiter } from './shared/middleware/rateLimit.middleware';
import { errorHandler } from './shared/middleware/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import productsRoutes from './modules/products/products.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import cartRoutes from './modules/cart/cart.routes';
import ordersRoutes from './modules/orders/orders.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import couponsRoutes from './modules/coupons/coupons.routes';
import webhooksRoutes from './modules/webhooks/webhooks.routes';

import { adminProductsRouter } from './modules/products/products.routes';
import { adminCategoriesRouter } from './modules/categories/categories.routes';
import { authenticate } from './shared/middleware/auth.middleware';
import { authorize } from './shared/middleware/role.middleware';
import * as adminController from './modules/auth/admin.controller';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

app.use('/api/v1/webhooks', webhooksRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/products/:productId/reviews', reviewsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/payments', paymentsRoutes);

app.use('/api/v1/admin/products', authenticate, authorize('ADMIN'), adminProductsRouter);
app.use('/api/v1/admin/categories', authenticate, authorize('ADMIN'), adminCategoriesRouter);
app.use('/api/v1/admin/coupons', couponsRoutes);

app.get('/api/v1/admin/dashboard', authenticate, authorize('ADMIN'), adminController.getDashboard);
app.get('/api/v1/admin/orders', authenticate, authorize('ADMIN'), adminController.getAllOrders);
app.put('/api/v1/admin/orders/:id/status', authenticate, authorize('ADMIN'), adminController.updateOrderStatus);
app.get('/api/v1/admin/users', authenticate, authorize('ADMIN'), adminController.getAllUsers);
app.put('/api/v1/admin/users/:id', authenticate, authorize('ADMIN'), adminController.updateUser);

app.use(errorHandler);

export default app;
