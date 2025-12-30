import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  KitchenTicket,
  KitchenTicketSchema,
} from './schemas/kitchen-ticket.schema';
import { KitchenTicketsService } from './kitchen-tickets.service';
import { KitchenTicketsController } from './kitchen-tickets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KitchenTicket.name, schema: KitchenTicketSchema },
    ]),
  ],
  controllers: [KitchenTicketsController],
  providers: [KitchenTicketsService],
  exports: [KitchenTicketsService],
})
export class KitchenTicketsModule {}
