import {  IsArray, IsString } from "class-validator";


interface Product {
    id: string;
    quantity: number;
}

export class UpdateProductQuantityDto {

    @IsArray()
    products: Product[];
}
