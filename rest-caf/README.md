# REST-CAF

API REST para gestión de sucursales, usuarios, categorías y productos.

## Configuración

- Variable de entorno requerida: `MONGODB_URI` (cadena de conexión a MongoDB).
- Swagger disponible en `/docs`.

### Arranque rápido

```powershell
# Windows PowerShell
$env:MONGODB_URI="mongodb://localhost:27017/restcaf"
pnpm install
pnpm start:dev
```

Abrir Swagger: http://localhost:3000/docs

## Módulo `branches`

- Esquema (Mongoose):
  - `_id: ObjectId`
  - `name: string`
  - `address: string`
  - `phone: string`
  - `active: boolean (default: true)`
  - `createdAt: Date`, `updatedAt: Date`

### Endpoints

- `POST /branches`: Crea una sucursal
- `GET /branches`: Lista sucursales
- `GET /branches/{id}`: Obtiene sucursal por ID
- `PATCH /branches/{id}`: Actualiza una sucursal
- `DELETE /branches/{id}`: Elimina una sucursal

## Módulo `users`

- Esquema (Mongoose):
  - `_id: ObjectId`
  - `name: string`
  - `email: string (único)`
  - `password: string`
  - `role: "ADMIN" | "CAJERO" | "COCINA" | "MESERO"`
  - `active: boolean (default: true)`
  - `branchId: ObjectId`
  - `createdAt: Date`, `updatedAt: Date`

### Endpoints

- `POST /users`: Crea un usuario
- `GET /users`: Lista usuarios
- `GET /users/{id}`: Obtiene usuario por ID
- `PATCH /users/{id}`: Actualiza un usuario
- `DELETE /users/{id}`: Elimina un usuario

## Módulo `categories`

- Esquema (Mongoose):
  - `_id: ObjectId`
  - `name: string`
  - `order: number`
  - `active: boolean (default: true)`
  - `branchId: ObjectId`
  - `createdAt: Date`, `updatedAt: Date`

### Endpoints

- `POST /categories`: Crea una categoría
- `GET /categories`: Lista categorías
- `GET /categories/{id}`: Obtiene categoría por ID
- `PATCH /categories/{id}`: Actualiza una categoría
- `DELETE /categories/{id}`: Elimina una categoría

## Módulo `products`

- Esquema (Mongoose):
  - `_id: ObjectId`
  - `categoryId: ObjectId`
  - `name: string`
  - `description: string`
  - `basePrice: number`
  - `hasVariants: boolean`
  - `hasExtras: boolean`
  - `active: boolean (default: true)`
  - `branchId: ObjectId`
  - `createdAt: Date`, `updatedAt: Date`

### Endpoints

- `POST /products`: Crea un producto
- `GET /products`: Lista productos
- `GET /products/{id}`: Obtiene producto por ID
- `PATCH /products/{id}`: Actualiza un producto
- `DELETE /products/{id}`: Elimina un producto

## Seed de datos

Script de seed crea sucursales, usuarios y productos de ejemplo.

```powershell
# Establecer conexión y ejecutar seed
$env:MONGODB_URI="mongodb://localhost:27017/restcaf"
pnpm run seed
```

- El seed vincula usuarios y productos a sucursales existentes.
- Los productos usan `categoryId` placeholder si no existen categorías previas.

## Notas de validación

- DTOs usan `class-validator` y `class-transformer`.
- `ValidationPipe` global habilitada con `whitelist`, `forbidNonWhitelisted` y `transform`.
