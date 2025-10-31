import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    email:string;

    @MinLength(6)
    @IsString()
    password:string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    cep: string;
}