import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Movement } from '../products/entities/movement.entity';

@Injectable()

export class StatisticsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
  ) { }

  async findAll() {
    try {
      const queryBuilder = this.movementRepository.createQueryBuilder();
      const mostActiveUsers = await queryBuilder
        .select('COUNT(*)', 'count')
        .leftJoinAndSelect('Movement.user', 'user')
        .groupBy('Movement.user.id, user.id')
        .orderBy('count', 'DESC')
        .getRawMany();
      return mostActiveUsers;
    } catch (error) {

      console.log(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }


}
