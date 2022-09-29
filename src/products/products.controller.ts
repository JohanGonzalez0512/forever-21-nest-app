import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductQuantityDto } from './dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '..//auth/entities/user.entity';

@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,) {
    return this.productsService.create(createProductDto, user);
  }

  @Post('quantity')
  update(
    @GetUser() user: User,
    @Body() updateProductQuantityDto: UpdateProductQuantityDto
  ) {
    return this.productsService.update(updateProductQuantityDto, user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('existence/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.checkExistance(id);
  }




}
