# 🛒 E-Commerce

Aplicación de comercio electrónico **full-stack** de producción: catálogo de productos con carrito, cobros con Stripe, órdenes, reseñas, gestión de usuario y un panel de administración completo.

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + React Query + Zustand
- **Backend:** Node.js + Express + TypeScript + Prisma (PostgreSQL) + Redis
- **Pagos:** Stripe (con modo de prueba integrado)
- **Base de datos:** Neon PostgreSQL (o cualquier PostgreSQL)

---

## 📦 Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 3, React Router 7, React Query (TanStack) 5, Zustand |
| Backend | Node.js, Express 4, TypeScript, Prisma ORM 5, Zod (validación) |
| Base de datos | PostgreSQL (Neon) |
| Cache/Sesiones | Redis (ioredis) |
| Authenticación | JWT (access + refresh tokens), bcryptjs |
| Pagos | Stripe |
| Email | Nodemailer (Mailhog para desarrollo) |
| Infra | Docker Compose, Nginx |

---

## 🧱 Estructura del proyecto

```
E-commerce/
├── backend/                  # API REST (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos de datos
│   │   └── seed.ts           # Datos de prueba
│   └── src/
│       ├── config/           # env, db, redis, stripe
│       ├── modules/          # auth, users, products, cart, orders,
│       │                     # payments, reviews, categories, coupons, webhooks
│       └── shared/           # middlewares y utilidades (auth, rate limit, errores)
├── frontend/                 # SPA React
│   └── src/
│       ├── api/              # Clientes de API
│       ├── components/       # UI, layout, cart, products, admin, checkout
│       ├── hooks/            # useCart, useProducts, useDebounce...
│       ├── pages/            # Páginas públicas y de admin
│       └── store/            # Zustand (auth, ui)
├── docker-compose.yml        # Infra + despliegue completo
├── docker-compose.dev.yml    # Postgres + Redis para desarrollo
└── nginx/                    # Configuración del servidor web
```

---

## ✨ Funcionalidades

### Público
- Catálogo de productos con búsqueda, filtros por categoría y ordenamiento.
- Detalle de producto con imágenes, variantes, precios comparativos y **reseñas**.
- Carrito persistente (backend), cupones de descuento.
- Checkout con **Stripe** y confirmación de pedido.
- Página de **categorías**.

### Usuario (`/perfil`, `/mis-ordenes`)
- Registro e inicio de sesión.
- **Recuperación de contraseña** por email (token único y expirable).
- Perfil con cambio de contraseña y **direcciones guardadas**.
- Historial de órdenes con cancelación de órdenes pendientes/confirmadas.

### Administrador (`/admin`)
- **Dashboard** con métricas del negocio.
- Gestión de **productos** (crear/editar/eliminar).
- Gestión de **órdenes** y de **usuarios**.
- Gestión de **cupones**.
- Vista rápida de altas de producto: `/createProducts`.

---

## 🚀 Puesta en marcha (desarrollo)

### Requisitos previos
- Node.js ≥ 18
- npm
- PostgreSQL y Redis (o [Docker](#-opción-docker))

### 1. Instalar dependencias

```bash
# Raíz
npm install        # scripts compartidos (opcional)

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar variables de entorno

Copia el ejemplo y ajusta los valores:

```bash
cd backend
cp .env.example .env
```

Variables principales (ver `.env.example` completo):

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `REDIS_URL` | URL de Redis |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secretos JWT |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Claves de Stripe |
| `FRONTEND_URL` | Origen del frontend para CORS |
| `PORT` | Puerto del backend (por defecto 3000) |

### 3. Migrar y sembrar la base de datos

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

> Prisma está fijado a la versión **5.22.0** — no la actualices a 8.0.0-rc.

### 4. Arrancar los servidores

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## 🐳 Opción Docker

Levanta la infraestructura (Postgres + Redis) y la app completa:

```bash
# Solo infraestructura para desarrollo
npm run db:up

# Despliegue completo (backend, frontend, db, redis, mailhog)
docker compose up --build
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
- `GET /products/:productId/reviews` — reseñas de un producto
- `GET /categories` — listar categorías

**Usuario** 🔒
- `GET /users/me` — perfil
- `PUT /users/me` / `PUT /users/me/password` — actualizar
- `GET|POST /users/me/addresses` · `DELETE /users/me/addresses/:id` — direcciones
- `GET|POST /cart` — carrito
- `POST /orders` — crear orden
- `GET /orders` — órdenes del usuario
- `POST /orders/:id/cancel` — cancelar orden

**Pagos** 🔒
- `POST /payments/create-intent` — iniciar pago Stripe
- `POST /payments/confirm` — confirmar pago

**Admin** 👑
- `GET /admin/dashboard` — métricas
- `GET|POST|PUT|DELETE /admin/products` — gestión de productos
- `GET /admin/orders` · `PUT /admin/orders/:id/status` — órdenes
- `GET /admin/users` · `PUT /admin/users/:id` — usuarios
- `POST /admin/coupons` — cupones

---

## 🗄️ Modelos de datos (Prisma)

`User`, `RefreshToken`, `Category`, `Product`, `ProductImage`, `Variant`, `Review`, `Address`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Coupon`.

---

## 📜 Scripts útiles

```bash
# Backend
npm run dev                  # desarrollo con recarga
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
- Rate limiting (límite general + 5 intentos de login por 15 min).
- Recuperación de contraseña con token expirable de un solo uso.
- Validación de stock atómica con transacciones de Prisma (evita sobreventa).
- Headers de seguridad con Helmet.
