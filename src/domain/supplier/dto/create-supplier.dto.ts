import { IsBoolean, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
import { AggregateRootDto } from "../../shared/aggregate-root.dto";


export class CreateSupplierDto extends AggregateRootDto{

    @IsNotEmpty({message:"Nome não deve ser vazio "})
    @IsString({message:"Nome deve ser string "})
    name:string;
    
    @IsNotEmpty({message:"CNPJ não deve ser vazio "})
    @IsString({message:"CNPJ deve ser string "})
    @Length(14,14,{message:"CNPJ deve conter 14 digitos "})
    cnpj:string;

    @IsNotEmpty({message:"Telefone não pode ser vazio "})
    @IsString({message:"Telefone deve ser string "})
    @IsPhoneNumber('BR',{message:"Telefone deve ser padrão brasileiro "})
    phone:string;

    @IsOptional()
    @IsString({message:"CEP deve ser string "})
    cep:string;

    @IsOptional()
    @IsBoolean({message:"Habilitado deve ser boolean "})
    enabled:boolean;

}