import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { AggregateRootDto } from "../../shared/aggregate-root.dto";


export class CreateInventoryDto extends AggregateRootDto{

    @IsNotEmpty({message:"Título não pode ser vazio "})
    @IsString({message:"Título deve ser string "})
    title:string;
    
    @IsNotEmpty({message:"Preço por unidade não pode ser vazio "})
    @IsNumber()
    @Min(0,{message:"Preço por unidade deve ser maior que zero "})
    price_per_unity:number;
    
    @IsNotEmpty({message:"Quantidade de produto não pode ser vazio "})
    @IsInt({message:"Quantidade de produto deve ser int "})
    @Min(0,{message:"Quantidade de produto deve ser number "})
    qty_product:number;
    
    @IsOptional()
    @IsBoolean({message:"Habilitado deve ser boolean "})
    enabled:boolean;
    
    @IsNotEmpty()
    @IsString({message:"Descrição deve ser string "})
    description:string;
    
    @IsNotEmpty({message:"Id da categoria não pode ser vazio "})
    @IsInt()
    @Min(0,{message:"Id da categoria deve ser maior que zero "})
    category_id:number;

    @IsNotEmpty({message:"Id do fornecedor não deve ser vazio "})
    @IsInt()
    @Min(0,{message:"Id do fornecedor deve ser maior que zero "})
    supplier_id:number;
    
}