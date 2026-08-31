# 🛒 E-Commerce

Aplicación de comercio electrónico **full-stack** de producción: catálogo de productos con búsqueda avanzada, carrito, favoritos, cobros con Stripe, órdenes con seguimiento, reseñas, gestión de usuario y un panel de administración completo con reportes.

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + React Query + Zustand
- **Backend:** Node.js + Express + TypeScript + Prisma (PostgreSQL)
- **Pagos:** Stripe (modo de prueba integrado)
- **Base de datos:** Neon PostgreSQL (o cualquier PostgreSQL)

---

## ⚠️ Requisitos previos

- **Node.js ≥ 18**
- **npm**
- **PostgreSQL** (local o Neon) — ya NO se usa Redis

---

## 📦 Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 3, React Router 7, React Query (TanStack) 5, Zustand |
| Backend | Node.js, Express 4, TypeScript, Prisma ORM 5 (fijado a **5.22.0**), Zod (validación) |
| Base de datos | PostgreSQL (Neon) |
| Authenticación | JWT (access + refresh tokens), bcryptjs |
| Pagos | Stripe |
| Imágenes | Cloudinary (opcional, requiere claves) |
| Email | Nodemailer (Mailhog para desarrollo) |

---

## 🧱 Estructura del proyecto

```
E-commerce/
├── backend/                  # API REST (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos de datos
│   │   └── seed.ts           # Datos de prueba
│   └── src/
│       ├── config/           # env, database, cloudinary, stripe
│       ├── modules/          # auth, users, products, cart, wishlist, orders,
│       │                     # payments, reviews, categories, coupons, uploads, webhooks
│       └── shared/           # middlewares y utilidades (auth, role, rate limit, errores)
├── frontend/                 # SPA React
│   └── src/
│       ├── api/              # Clientes de API
│       ├── components/       # UI, layout, cart, products, admin, checkout
│       ├── hooks/            # useCart, useProducts, useWishlist, useDebounce...
│       ├── pages/            # Páginas públicas y de admin
│       ├── lib/              # utilidades (formato, categorías, csv)
│       └── store/            # Zustand (auth, ui)
└── scripts/ o utilidades     # según necesidades
```

*Las migraciones de Prisma no se versionan en este repositorio; se aplican con `prisma migrate dev` / `db push`.*
*Arquitectura "package by feature": cada dominio vive en `modules/<dominio>` y el código transversal en `shared/`.*

---

## ✨ Funcionalidades

### Público
- Catálogo de productos con búsqueda, filtros por categoría y por rango de precio, y ordenamiento.
- Detalle de producto con imágenes, variantes, precios comparativos y **reseñas**.
- **Productos relacionados** ("Quizá también te guste") en el detalle.
- Carrito persistente (backend), cupones de descuento.
- Checkout con **Stripe** y confirmación de pedido.
- Página de **categorías**.

### Usuario (`/perfil`, `/mis-ordenes`, `/mis-favoritos`)
- Registro e inicio de sesión.
- **Recuperación de contraseña** por email (token único y expirable).
- Perfil con cambio de contraseña y **direcciones guardadas**.
- **Lista de deseos / favoritos**.
- Historial de órdenes con detalle expandible, seguimiento de estado y cancelación de órdenes pendientes/confirmadas.

### Administrador (`/admin`)
- **Dashboard** con métricas, top productos, stock bajo y ventas por día.
- Gestión de **productos** (crear/editar/eliminar) con subida de imagen a Cloudinary.
- Gestión de **órdenes** y de **usuarios** con **exportación a CSV**.
- Gestión de **cupones**.
- Vista rápida de altas de producto: `/createProducts`.

---

## 🚀 Puesta en marcha (desarrollo)

### 1. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configurar variables de entorno

```bash
cd backend
cp .env.example .env
```

Variables principales (ver `.env.example` completo):

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secretos JWT |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Claves de Stripe |
| `FRONTEND_URL` | Origen del frontend para CORS |
| `PORT` | Puerto del backend (por defecto 3000) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Claves de Cloudinary (opcionales, para subir imágenes) |

### 3. Migrar y sembrar la base de datos

```bash
cd backend
npx prisma generate
npx prisma migrate dev     # o: npx prisma db push
npm run prisma:seed
```

> Prisma está fijado a la versión **5.22.0** — no la actualices a 8.x.

### 4. Arrancar los servidores

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend
npm run dev        # usa tsx watch (compila TS y recarga al vuelo)

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## 🧪 Credenciales de prueba (seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Administrador** | `admin@ecommerce.com` | `Admin123!` |
| **Usuario** | `user@ecommerce.com` | `User123!` |

**Cupones de prueba:** `BIENVENIDO10`, `AHORRO50`

---

## 📁 Endpoints principales de la API

Todas las rutas van bajo `/api/v1`. Rutas protegidas con 🔒 (JWT) y de admin con 👑.

**Autenticación**
- `POST /auth/register` — registro
- `POST /auth/login` — inicio de sesión
- `POST /auth/forgot-password` — solicitar recuperación
- `POST /auth/reset-password` — restablecer contraseña

**Productos y catálogo**
- `GET /products` — listar (filtros por categoría, precio, búsqueda, orden)
- `GET /products/:slug` — detalle
- `GET /products/related?slug=` — productos relacionados
- `GET /products/:productId/reviews` — reseñas de un producto
- `GET /categories` — listar categorías

**Usuario** 🔒
- `GET /users/me` — perfil
- `PUT /users/me` / `PUT /users/me/password` — actualizar
- `GET|POST /users/me/addresses` · `DELETE /users/me/addresses/:id` — direcciones
- `GET|POST /cart` — carrito
- `GET|POST /wishlist` · `POST /wishlist/:id` — favoritos
- `POST /orders` — crear orden
- `GET /orders` — órdenes del usuario
- `POST /orders/:id/cancel` — cancelar orden

**Pagos** 🔒
- `POST /payments/create-intent` — iniciar pago Stripe
- `POST /payments/confirm` — confirmar pago

**Admin** 👑
- `GET /admin/dashboard` — métricas y reportes
- `GET /admin/export/:type` — exportar CSV (`orders`, `products`, `users`)
- `GET|POST|PUT|DELETE /admin/products` — gestión de productos
- `GET /admin/orders` · `PUT /admin/orders/:id/status` — órdenes
- `GET /admin/users` · `PUT /admin/users/:id` — usuarios
- `POST /admin/coupons` — cupones

---

## 🗄️ Modelos de datos (Prisma)

`User`, `RefreshToken`, `Category`, `Product`, `ProductImage`, `Variant`, `Review`, `Address`, `Cart`, `CartItem`, `WishlistItem`, `Order`, `OrderItem`, `Coupon`.

---

## 📜 Scripts útiles

```bash
# Backend
npm run dev                  # desarrollo con recarga (tsx watch)
npm run build && npm start   # producción
npm run prisma:studio        # explorar la DB
npm run prisma:migrate       # migraciones

# Frontend
npm run dev                  # desarrollo
npm run build                # build de producción
```

---

## 🔒 Seguridad implementada

- Contraseñas hasheadas con bcrypt.
- Autenticación JWT con tokens de acceso y refresco.
- Rate limiting (límite general + intentos de login por 15 min).
- Recuperación de contraseña con token expirable de un solo uso.
- Validación de stock atómica con transacciones de Prisma (evita sobreventa).
- Headers de seguridad con Helmet.
