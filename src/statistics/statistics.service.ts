import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Movement } from '../products/entities/movement.entity';
import { Order } from '../orders/entities';

@Injectable()

export class StatisticsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

  ) { }

  async findAll(startDate: string, endDate: string) {
    try {


      const queryBuilderMovements = this.movementRepository.createQueryBuilder();
      const mostActiveUsers = await queryBuilderMovements
        .select('COUNT(*)', 'count')
        .leftJoinAndSelect('Movement.user', 'user')
        .groupBy('Movement.user.id, user.id')
        .orderBy('count', 'DESC')
        .where('Movement.lastUpdated BETWEEN :startDate AND :endDate',
          { startDate, endDate })
        .getRawMany();




      const products = await this.productRepository.find({
        select: ['name', 'quantity'],
        order: {
          quantity: 'DESC',
        },
        where: {
          creationDate: Between(new Date(startDate), new Date(endDate)),
        }
      });



      const queryBuilderOrders = this.orderRepository.createQueryBuilder();
      const mostActiveOrders = await queryBuilderOrders
        .select('COUNT(*)', 'count')
        .leftJoinAndSelect('Order.user', 'user')
        .groupBy('Order.status, user.id')
        .orderBy('count', 'DESC')
        .where('Order.status = :status', { status: true })
        .where('Order.date BETWEEN :startDate AND :endDate',
          { startDate, endDate })
        .getRawMany();




      return {

        products,

        mostActiveUser: mostActiveUsers.map((user) => {
          return {
            user: user.user_fullName,
            movements: +user.count,
          };
        }),
        mostActiveOrders: mostActiveOrders.map((order) => {
          return {
            user: order.user_fullName,
            orders: +order.count,
          };
        }),
      };




    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message);
    }
  }




}
