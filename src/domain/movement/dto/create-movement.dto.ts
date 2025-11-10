import { IsInt, IsNotEmpty, Min } from "class-validator";
import { AggregateRootDto } from "../../shared/aggregate-root.dto";


export class CreateMovementDto extends AggregateRootDto{

    @IsNotEmpty({message:"Id do item não pode ser vazio "})
    @IsInt()
    @Min(0,{message:"Id do item deve ser maior que zero "})
    inventory_id:number;

    @IsNotEmpty({message:"Id do usuário não pode ser vazio "})
    @IsInt()
    @Min(0,{message:"Id do usuário deve ser maior que zero "})
    user_id:number;
    
    @IsInt({message:"Quantidade deve ser int"})
    quantity: number;

}