import { IsArray, IsUUID } from "class-validator";

interface OrderItem {
    SKU: string;
    quantity: number;
}

export class CreateOrderDto {

    @IsArray()
    products: OrderItem[];

    @IsUUID()
    user: string;



}
