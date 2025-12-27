# TODO

- [ ] ¿Deseas que agregue lógica para autogenerar `orderNumber` secuencial por sucursal y calcular `subtotal`/`tax`/`total` desde los `items`?
  - Propuesta: Implementar en `OrdersService.create()`.
  - Detalle: Obtener último `orderNumber` por `branchId`, incrementar. Calcular montos con base en `unitPrice`, `quantity`, `variant.priceModifier` y `extras.price`.
  - IVA sugerido: 16% configurable (por `ConfigModule`).
