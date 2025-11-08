import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({message:"Nome não deve ser vazio"})
    @IsString({message:"Nome deve ser string"})
    name:string;

    @IsNotEmpty({message:"Email não pode ser vazio"})
    @IsString({message:"Email deve ser string"})
    email:string;

    @MinLength(6,{message:"Senha deve conter no minimo 6 caracteres"})
    @IsString({message:"Senha deve ser string"})
    password:string;

    @IsOptional()
    @IsString({message:"Telefone deve ser string"})
    phone: string;

    @IsOptional()
    @IsString({message:"CEP deve ser string"})
    cep: string;
}