import { PartialType } from '@nestjs/swagger';
import { CreateProductExtraDto } from './create-product-extra.dto';

export class UpdateProductExtraDto extends PartialType(CreateProductExtraDto) {}
