import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../auth/entities/user.entity';
import { Movement, Product } from './entities';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }


  async create(createProductDto: CreateProductDto, user: User) {
    try {

      let productExistance = await this.productRepository.findOneBy({ name: createProductDto.name });

      if (productExistance)
        throw new BadRequestException('Product already exists');


      const product = this.productRepository.create({
        ...createProductDto,
        office: user.office,
      });
      await this.productRepository.save(product);

      const movement = this.movementRepository.create({
        description: 'Product created',
        lastUpdated: new Date(),
        product,
        user,
      });

      await this.movementRepository.save(movement);

      return movement

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  async checkExistance(id: number) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      return {
        existance: product ? true : false,
      }

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }


  // TODO: Actualizar existencias productos: CHECAR BIEN 
  //puede variar dependiendo como lo vayas a pinches hacer en el frontend


  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }


  private handleDBExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    if (error.response) {
      if (error.response.statusCode === 400) {
        throw new BadRequestException(error.response.message);
      }
    }

    console.log(error)


    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
