import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductExtra,
  ProductExtraSchema,
} from './schemas/product-extra.schema';
import { ProductExtrasService } from './product-extras.service';
import { ProductExtrasController } from './product-extras.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductExtra.name, schema: ProductExtraSchema },
    ]),
  ],
  controllers: [ProductExtrasController],
  providers: [ProductExtrasService],
  exports: [ProductExtrasService],
})
export class ProductExtrasModule {}
