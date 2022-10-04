import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement, Product } from '../products/entities';
import { Order, Orders_products } from '../orders/entities';
import { User } from '../auth/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, 
      Movement,
      Order, 
      Orders_products,
      User
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule { }
