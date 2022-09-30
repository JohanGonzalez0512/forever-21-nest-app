import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

interface OrderItem {
    SKU: string;
    quantity: number;
}

export class CreateOrderDto {

    @IsNotEmpty()
    @IsArray()
    products: OrderItem[];

    @IsUUID()
    user: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;



}
