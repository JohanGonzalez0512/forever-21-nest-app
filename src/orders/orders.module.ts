import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Office } from 'src/offices/entities/office.entity';
import { Orders_products, Order } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product, Office, Orders_products]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [
    OrdersService,
    TypeOrmModule
  ]
})
export class OrdersModule { }
