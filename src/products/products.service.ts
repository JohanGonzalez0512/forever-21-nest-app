import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductQuantityDto } from './dto';
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

      let productExistance = await this.productRepository.findOne(
        {
          where: {
            name: createProductDto.name,
            SKU: createProductDto.SKU,
            office: { id: user.office.id },
          },
          relations: ['office'],

        });

      if (productExistance)
        throw new BadRequestException('Product already exists');


      const product = this.productRepository.create({
        ...createProductDto,
        creationDate: new Date(),
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
    try {
      return this.productRepository.find(
        {
          relations: ['office'],
        });
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async checkExistance(SKU: string) {
    try {
      const product = await this.productRepository.findOneBy({ SKU });
      return {
        existance: product ? true : false,
        product: {
          name: product ? product.name : null,
          SKU: product ? product.SKU : null,
          quantity: product ? product.quantity : null
        }
      }

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async update(updateProductQuantityDto: UpdateProductQuantityDto, user: User) {
    try {


      const { products: productsToUpdate } = updateProductQuantityDto;

      let products = await this.productRepository.find({
        where: {
          SKU: In(productsToUpdate.map(product => product.SKU)),
        }
      })

      if (products.length !== productsToUpdate.length)
        throw new BadRequestException('Some products dont exist');



      const insertPromises = [];

      products.forEach(product => {
        const productToUpdate = productsToUpdate.find(productToUpdate => productToUpdate.SKU === product.SKU);
        productToUpdate.quantity = product.quantity + productToUpdate.quantity;
        insertPromises.push(this.productRepository.update(product.id, productToUpdate));
      })

      await this.productRepository.save(products);

      const movements = products.map(product => {
        return this.movementRepository.create({
          description: 'Product updated',
          lastUpdated: new Date(),
          product,
          user,
        });
      });

      await this.movementRepository.save(movements);

      return movements;

    } catch (error) {
      this.handleDBExceptions(error)

      
    }

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
