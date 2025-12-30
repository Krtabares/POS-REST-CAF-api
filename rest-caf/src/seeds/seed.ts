import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Branch, BranchDocument } from '../branch/schemas/branch.schema';
import { User, UserDocument, UserRole } from '../user/schemas/user.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import {
  ProductVariant,
  ProductVariantDocument,
  VariantName,
} from '../product-variants/schemas/product-variant.schema';
import {
  Category,
  CategoryDocument,
} from '../category/schemas/category.schema';
import {
  ProductExtra,
  ProductExtraDocument,
} from '../product-extras/schemas/product-extra.schema';
import {
  Table,
  TableDocument,
  TableStatus,
} from '../tables/schemas/table.schema';
import {
  Order,
  OrderDocument,
  OrderType,
  OrderStatus,
  PaymentStatus,
} from '../orders/schemas/order.schema';
import {
  Payment,
  PaymentDocument,
  PaymentMethod,
  PaymentStatus as PayStatus,
} from '../payments/schemas/payment.schema';
import {
  KitchenTicket,
  KitchenTicketDocument,
  KitchenTicketStatus,
} from '../kitchen-tickets/schemas/kitchen-ticket.schema';

async function run() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const branchModel = appContext.get<Model<BranchDocument>>(
    getModelToken(Branch.name),
  );
  const userModel = appContext.get<Model<UserDocument>>(
    getModelToken(User.name),
  );
  const productModel = appContext.get<Model<ProductDocument>>(
    getModelToken(Product.name),
  );
  const variantModel = appContext.get<Model<ProductVariantDocument>>(
    getModelToken(ProductVariant.name),
  );
  const categoryModel = appContext.get<Model<CategoryDocument>>(
    getModelToken(Category.name),
  );
  const extraModel = appContext.get<Model<ProductExtraDocument>>(
    getModelToken(ProductExtra.name),
  );
  const tableModel = appContext.get<Model<TableDocument>>(
    getModelToken(Table.name),
  );
  const orderModel = appContext.get<Model<OrderDocument>>(
    getModelToken(Order.name),
  );
  const paymentModel = appContext.get<Model<PaymentDocument>>(
    getModelToken(Payment.name),
  );
  const ticketModel = appContext.get<Model<KitchenTicketDocument>>(
    getModelToken(KitchenTicket.name),
  );

  const branchesSeed: Array<Omit<Branch, '_id' | 'createdAt' | 'updatedAt'>> = [
    {
      name: 'Sucursal Centro',
      address: 'Av. Principal 123, Ciudad',
      phone: '+52 55 1234 5678',
      active: true,
    },
    {
      name: 'Sucursal Norte',
      address: 'Calle Secundaria 456, Ciudad',
      phone: '+52 55 9876 5432',
      active: true,
    },
  ];

  const branchIdByName = new Map<string, Types.ObjectId>();

  for (const b of branchesSeed) {
    const doc = await branchModel.findOneAndUpdate(
      { name: b.name },
      { $set: b },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    branchIdByName.set(b.name, doc._id as Types.ObjectId);
  }

  // Seed de categorías por sucursal
  const categoriesSeed: Array<{
    name: string;
    order: number;
    active: boolean;
    branchName: string;
  }> = [
    { name: 'Bebidas', order: 1, active: true, branchName: 'Sucursal Centro' },
    {
      name: 'Alimentos',
      order: 2,
      active: true,
      branchName: 'Sucursal Centro',
    },
    { name: 'Postres', order: 3, active: true, branchName: 'Sucursal Centro' },
    { name: 'Bebidas', order: 1, active: true, branchName: 'Sucursal Norte' },
    { name: 'Alimentos', order: 2, active: true, branchName: 'Sucursal Norte' },
    { name: 'Postres', order: 3, active: true, branchName: 'Sucursal Norte' },
  ];

  const categoryIdByKey = new Map<string, Types.ObjectId>();

  for (const c of categoriesSeed) {
    const branchId = branchIdByName.get(c.branchName);
    if (!branchId)
      throw new Error(`Branch not found for category seed: ${c.branchName}`);

    const doc = await categoryModel.findOneAndUpdate(
      { name: c.name, branchId },
      { $set: { name: c.name, order: c.order, active: c.active, branchId } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    categoryIdByKey.set(`${c.name}:${c.branchName}`, doc._id as Types.ObjectId);
  }

  // Seed de mesas por sucursal (1..10 por defecto)
  for (const [branchName, branchId] of branchIdByName) {
    const totalTables = 10;
    for (let n = 1; n <= totalTables; n++) {
      await tableModel.updateOne(
        { number: n, branchId },
        {
          $set: {
            number: n,
            status: TableStatus.FREE,
            branchId,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }
  }

  const usersSeed = [
    {
      name: 'Admin Centro',
      email: 'admin.centro@example.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      active: true,
      branchName: 'Sucursal Centro',
    },
    {
      name: 'Cajero Norte',
      email: 'cajero.norte@example.com',
      password: 'cajero123',
      role: UserRole.CAJERO,
      active: true,
      branchName: 'Sucursal Norte',
    },
  ];

  for (const u of usersSeed) {
    const branchId = branchIdByName.get(u.branchName);
    if (!branchId)
      throw new Error(`Branch not found for user seed: ${u.branchName}`);

    await userModel.updateOne(
      { email: u.email },
      {
        $set: {
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
          active: u.active,
          branchId: branchId,
        },
      },
      { upsert: true },
    );
  }

  const productsSeed = [
    {
      name: 'Café Americano',
      description: 'Café negro tradicional',
      basePrice: 35,
      hasVariants: true,
      hasExtras: true,
      active: true,
      branchName: 'Sucursal Centro',
      categoryName: 'Bebidas',
    },
    {
      name: 'Café Capuchino',
      description: 'Café con leche y espuma',
      basePrice: 45,
      hasVariants: true,
      hasExtras: true,
      active: true,
      branchName: 'Sucursal Centro',
      categoryName: 'Bebidas',
    },
    {
      name: 'Sandwich Jamón',
      description: 'Jamón, queso y vegetales frescos',
      basePrice: 50,
      hasVariants: false,
      hasExtras: true,
      active: true,
      branchName: 'Sucursal Norte',
      categoryName: 'Alimentos',
    },
    {
      name: 'Refresco',
      description: 'Bebida gaseosa en lata',
      basePrice: 25,
      hasVariants: false,
      hasExtras: false,
      active: true,
      branchName: 'Sucursal Norte',
      categoryName: 'Bebidas',
    },
  ];

  for (const p of productsSeed) {
    const branchId = branchIdByName.get(p.branchName);
    if (!branchId)
      throw new Error(`Branch not found for product seed: ${p.branchName}`);

    const categoryKey = `${p.categoryName}:${p.branchName}`;
    const categoryId = categoryIdByKey.get(categoryKey);
    if (!categoryId)
      throw new Error(`Category not found for product seed: ${categoryKey}`);

    await productModel.updateOne(
      { name: p.name, branchId },
      {
        $set: {
          categoryId,
          name: p.name,
          description: p.description,
          basePrice: p.basePrice,
          hasVariants: p.hasVariants,
          hasExtras: p.hasExtras,
          active: p.active,
          branchId,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  // Crear variantes por defecto para productos con hasVariants
  const productsWithVariants = await productModel
    .find({ hasVariants: true })
    .lean();

  for (const prod of productsWithVariants) {
    const existing = await variantModel.countDocuments({ productId: prod._id });
    if (existing > 0) continue;

    const variants = [
      { name: VariantName.PEQUENO, priceModifier: 0, active: true },
      { name: VariantName.MEDIANO, priceModifier: 10, active: true },
      { name: VariantName.GRANDE, priceModifier: 20, active: true },
    ];

    for (const v of variants) {
      await variantModel.updateOne(
        { productId: prod._id, name: v.name },
        {
          $set: {
            productId: prod._id,
            name: v.name,
            priceModifier: v.priceModifier,
            active: v.active,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }
  }

  // Crear extras por defecto para productos con hasExtras
  const productsWithExtras = await productModel
    .find({ hasExtras: true })
    .lean();

  for (const prod of productsWithExtras) {
    const existingExtras = await extraModel.countDocuments({
      productId: prod._id,
    });
    if (existingExtras > 0) continue;

    const extras = [
      { name: 'Extra shot', price: 8, active: true },
      { name: 'Leche de almendra', price: 12, active: true },
      { name: 'Jarabe vainilla', price: 6, active: true },
    ];

    for (const e of extras) {
      await extraModel.updateOne(
        { productId: prod._id, name: e.name },
        {
          $set: {
            productId: prod._id,
            name: e.name,
            price: e.price,
            active: e.active,
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      );
    }
  }

  // Seed de órdenes de ejemplo
  const userIdByName = new Map<string, Types.ObjectId>();
  const usersAll = await userModel.find({}).lean();
  for (const u of usersAll) {
    userIdByName.set(u.name as string, u._id as Types.ObjectId);
  }

  async function findProduct(branchId: Types.ObjectId, name: string) {
    return productModel.findOne({ branchId, name }).lean();
  }

  async function findVariant(productId: Types.ObjectId, name: string) {
    return variantModel.findOne({ productId, name }).lean();
  }

  async function findExtra(productId: Types.ObjectId, name: string) {
    return extraModel.findOne({ productId, name }).lean();
  }

  function calcItemTotal(unitPrice: number, quantity: number) {
    return unitPrice * quantity;
  }

  function calcOrderTotals(items: Array<{ total: number }>) {
    const subtotal = items.reduce((sum, it) => sum + it.total, 0);
    const tax = Math.round(subtotal * 0.16 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    return { subtotal, tax, total };
  }

  // Orden DINE_IN en Sucursal Centro
  {
    const branchId = branchIdByName.get('Sucursal Centro');
    if (!branchId) throw new Error('Branch not found: Sucursal Centro');

    const createdBy = userIdByName.get('Admin Centro');
    if (!createdBy) throw new Error('User not found: Admin Centro');

    const table = await tableModel.findOne({ number: 1, branchId }).lean();
    const tableId = table?._id ?? null;

    const prodCafe = await findProduct(branchId, 'Café Americano');
    const prodCapu = await findProduct(branchId, 'Café Capuchino');
    if (!prodCafe || !prodCapu)
      throw new Error('Seed products missing in Centro');

    const varMediano = await findVariant(
      prodCafe._id as Types.ObjectId,
      'Mediano',
    );
    const extraShot = await findExtra(
      prodCafe._id as Types.ObjectId,
      'Extra shot',
    );

    const cafeBase = prodCafe.basePrice as number;
    const cafeUnit =
      cafeBase + (varMediano?.priceModifier ?? 0) + (extraShot?.price ?? 0);
    const cafeQty = 2;
    const cafeTotal = calcItemTotal(cafeUnit, cafeQty);

    const capuUnit = prodCapu.basePrice as number;
    const capuQty = 1;
    const capuTotal = calcItemTotal(capuUnit, capuQty);

    const items = [
      {
        productId: prodCafe._id,
        name: prodCafe.name,
        variant: varMediano
          ? {
              variantId: varMediano._id,
              name: varMediano.name,
              priceModifier: varMediano.priceModifier,
            }
          : undefined,
        extras: extraShot
          ? [
              {
                extraId: extraShot._id,
                name: extraShot.name,
                price: extraShot.price,
              },
            ]
          : [],
        quantity: cafeQty,
        unitPrice: cafeUnit,
        total: cafeTotal,
      },
      {
        productId: prodCapu._id,
        name: prodCapu.name,
        extras: [],
        quantity: capuQty,
        unitPrice: capuUnit,
        total: capuTotal,
      },
    ];

    const totals = calcOrderTotals(items);

    await orderModel.updateOne(
      { orderNumber: 1001, branchId },
      {
        $set: {
          orderNumber: 1001,
          type: OrderType.DINE_IN,
          tableId,
          status: OrderStatus.CREATED,
          paymentStatus: PaymentStatus.PENDING,
          items,
          subtotal: totals.subtotal,
          tax: totals.tax,
          total: totals.total,
          createdBy,
          branchId,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );

    // Crear/actualizar ticket de cocina para la orden 1001
    const orderDocCentro = await orderModel
      .findOne({ orderNumber: 1001, branchId })
      .lean();
    if (!orderDocCentro)
      throw new Error('Order not found for kitchen ticket: 1001');

    const ticketItemsCentro = items.map((it) => ({
      name: it.name as string,
      quantity: it.quantity as number,
      notes: 'Preparar rápido',
    }));

    await ticketModel.updateOne(
      { orderId: orderDocCentro._id as Types.ObjectId, branchId },
      {
        $set: {
          orderId: orderDocCentro._id as Types.ObjectId,
          items: ticketItemsCentro,
          status: KitchenTicketStatus.PENDING,
          priority: 1,
          branchId,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );

    // Crear/actualizar pago para la orden 1001 (efectivo, pagado)
    await paymentModel.updateOne(
      { orderId: orderDocCentro._id as Types.ObjectId, branchId },
      {
        $set: {
          orderId: orderDocCentro._id as Types.ObjectId,
          method: PaymentMethod.CASH,
          amount: totals.total,
          status: PayStatus.PAID,
          paidAt: new Date(),
          branchId,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  // Orden TAKE_AWAY en Sucursal Norte
  {
    const branchId = branchIdByName.get('Sucursal Norte');
    if (!branchId) throw new Error('Branch not found: Sucursal Norte');

    const createdBy = userIdByName.get('Cajero Norte');
    if (!createdBy) throw new Error('User not found: Cajero Norte');

    const prodSandwich = await findProduct(branchId, 'Sandwich Jamón');
    const prodRefresco = await findProduct(branchId, 'Refresco');
    if (!prodSandwich || !prodRefresco)
      throw new Error('Seed products missing in Norte');

    const sandwichUnit = prodSandwich.basePrice as number;
    const sandwichQty = 1;
    const sandwichTotal = calcItemTotal(sandwichUnit, sandwichQty);

    const refUnit = prodRefresco.basePrice as number;
    const refQty = 1;
    const refTotal = calcItemTotal(refUnit, refQty);

    const items = [
      {
        productId: prodSandwich._id,
        name: prodSandwich.name,
        extras: [],
        quantity: sandwichQty,
        unitPrice: sandwichUnit,
        total: sandwichTotal,
      },
      {
        productId: prodRefresco._id,
        name: prodRefresco.name,
        extras: [],
        quantity: refQty,
        unitPrice: refUnit,
        total: refTotal,
      },
    ];

    const totals = calcOrderTotals(items);

    await orderModel.updateOne(
      { orderNumber: 1002, branchId },
      {
        $set: {
          orderNumber: 1002,
          type: OrderType.TAKE_AWAY,
          tableId: null,
          status: OrderStatus.CREATED,
          paymentStatus: PaymentStatus.PENDING,
          items,
          subtotal: totals.subtotal,
          tax: totals.tax,
          total: totals.total,
          createdBy,
          branchId,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );

    // Crear/actualizar ticket de cocina para la orden 1002
    const orderDocNorte = await orderModel
      .findOne({ orderNumber: 1002, branchId })
      .lean();
    if (!orderDocNorte)
      throw new Error('Order not found for kitchen ticket: 1002');

    const ticketItemsNorte = items.map((it) => ({
      name: it.name as string,
      quantity: it.quantity as number,
      notes: 'Para llevar',
    }));

    await ticketModel.updateOne(
      { orderId: orderDocNorte._id as Types.ObjectId, branchId },
      {
        $set: {
          orderId: orderDocNorte._id as Types.ObjectId,
          items: ticketItemsNorte,
          status: KitchenTicketStatus.IN_PROGRESS,
          priority: 2,
          branchId,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );

    // Crear/actualizar pago para la orden 1002 (tarjeta, pendiente)
    await paymentModel.updateOne(
      { orderId: orderDocNorte._id as Types.ObjectId, branchId },
      {
        $set: {
          orderId: orderDocNorte._id as Types.ObjectId,
          method: PaymentMethod.CARD,
          amount: totals.total,
          status: PayStatus.PENDING,
          paidAt: null,
          branchId,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  await appContext.close();
}

run()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed', err);
    process.exit(1);
  });
