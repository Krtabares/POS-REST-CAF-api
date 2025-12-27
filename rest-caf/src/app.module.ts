import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BranchModule } from './branch/branch.module';
import { ProductModule } from './products/product.module';
import { CategoryModule } from './category/category.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { ProductExtrasModule } from './product-extras/product-extras.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(process.env.MONGODB_URI
      ? [
          MongooseModule.forRoot(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
          }),
        ]
      : []),
    UserModule,
    BranchModule,
    ProductModule,
    CategoryModule,
    ProductVariantsModule,
    ProductExtrasModule,
    TablesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
