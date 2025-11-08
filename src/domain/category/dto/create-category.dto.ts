import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AggregateRootDto } from "../../shared/aggregate-root.dto";


export class CreateCategoryDto extends AggregateRootDto{

    @IsNotEmpty({message:"Descrição não pode ser vazia"})
    @IsString({message:"Descrição tem que ser string"})
    description:string;

    @IsOptional()
    @IsBoolean({message:"Habilitado deve ser booleano"})
    enabled:boolean;

    @IsOptional()
    @IsString({message:"Título deve ser string"})
    title:string;

    @IsOptional()
    @IsString({message:"Cor deve ser string"})
    color:string;

}