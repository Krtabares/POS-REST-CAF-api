import { PartialType } from '@nestjs/swagger';
import { CreateKitchenTicketDto } from './create-kitchen-ticket.dto';

export class UpdateKitchenTicketDto extends PartialType(
  CreateKitchenTicketDto,
) {}
