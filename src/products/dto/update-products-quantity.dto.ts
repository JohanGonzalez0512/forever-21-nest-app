import {  IsArray, IsString } from "class-validator";


interface Product {
    SKU: string;
    quantity: number;
}

export class UpdateProductQuantityDto {

    @IsArray()
    products: Product[];
}
