import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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



  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('existance/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.checkExistance(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
