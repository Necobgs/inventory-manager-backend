import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto{

    @IsNotEmpty({message:"Email não pode ser vazio"})
    @IsString({message:"Email deve ser string"})
    email:string;

    @IsNotEmpty({message:"Email não pode ser vazio"})
    @IsString({message:"Email deve ser string"})
    password:string;

}