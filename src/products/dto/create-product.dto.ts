import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @MinLength(1)
    name: string;
}
