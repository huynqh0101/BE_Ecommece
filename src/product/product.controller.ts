import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  // Create a new product
  @Post('create')
  create(@Body() productDto: Partial<Product>): Promise<Product> {
    return this.productService.create(productDto);
  }

  // Get all products
  @Get('find-all')
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // Get a product by ID
  @Get('find/:id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  // Update a product by ID
  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() productDto: Partial<Product>
  ): Promise<Product> {
    return this.productService.update(id, productDto);
  }

  // Delete a product by ID
  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
