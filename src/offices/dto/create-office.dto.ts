import { IsString, MinLength } from "class-validator";

export class CreateOfficeDto {

    @IsString()
    @MinLength(1)
    name: string;
   
}

