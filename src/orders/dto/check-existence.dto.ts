import { IsString } from "class-validator";


export class CheckExistenceDto {

    @IsString()
    SKU: string;

    @IsString()
    id: string;
}
