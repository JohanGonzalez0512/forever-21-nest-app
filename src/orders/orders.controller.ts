import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { CheckExistenceDto } from './dto/check-existence.dto';

@Controller('orders')
@Auth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(
    @GetUser() user: User,
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.create(createOrderDto, user);
  }
  @Post('existence')
  checkExistence(
    @Body() checkExistenceDto: CheckExistenceDto
  ) {
    return this.ordersService.checkExistence(checkExistenceDto);
  }

  @Get()
  findAll(
    @GetUser() user: User,
  ) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.completeOrder(id, updateOrderDto);
  }

}
