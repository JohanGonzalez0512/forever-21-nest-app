import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, Orders_products } from './entities';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {


  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Orders_products)
    private readonly orders_productsRepository: Repository<Orders_products>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }



  async create(createOrderDto: CreateOrderDto, user: User) {
    try {

      const { user: userId, products } = createOrderDto;

      const userExists = await this.userRepository.findOneBy({ id: userId });
      if (!userExists)
        throw new BadRequestException('User does not exist');

      let productsToOrder = await this.productRepository.find({
        where: {
          SKU: In(products.map(product => product.SKU)),
        }
      })

      if (productsToOrder.length !== products.length)
        throw new BadRequestException('Some products dont exist');

      const order = this.orderRepository.create({
        user: userExists,
        office: user.office
      });

      await this.orderRepository.save(order);

      const orders_products = productsToOrder.map(product => {
        return this.orders_productsRepository.create({
          order,
          product,
          quantity: products.find(p => p.SKU === product.SKU).quantity
        });
      }
      );

      await this.orders_productsRepository.save(orders_products);

      const results = orders_products.map(order_product => {
        const { product, quantity, order } = order_product;
        const { SKU, name } = product;
        delete order.office;

        return {
          product: {
            SKU,
            name,
            quantity
          },
          order
        }
      });

      return {
        results
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(user: User) {
    try {
      const orders = await this.orderRepository.find({
        where: {
          user: { id: user.id }
        },
        relations: ['user', 'orders_products']
      });

      let products = await this.orders_productsRepository.find({
        where: {
          order: In(orders.map(order => order.id))
        },
        relations: ['product', 'order']
      });

      const results = orders.map(order => {
        const { id, status, orders_products } = order;

        const newProducts = products.filter(product => product.order.id === id);
        console.log(products, 'products', 'id', id);


        return {
          id,
          status,
          
          products: newProducts.map(product => {
            const { SKU, name, imageURL, id } = product.product;
            return {
              id,
              SKU,
              name,
              imageURL,
            }
          }),
          length: newProducts.length

        }

      });

      return {
        results
      }

    }




    catch (error) {

    }


  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async completeOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {

      const order = await this.orderRepository.findOneBy({ id });
      if (!order)
        throw new BadRequestException('Order does not exist');

      await this.orderRepository.update(id, {
        status: updateOrderDto.status
      });

      return {
        order: {
          ...order,
          status: updateOrderDto.status
        }

      };



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
