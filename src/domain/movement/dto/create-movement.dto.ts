import { IsInt, IsNotEmpty, IsPositive, NotEquals } from "class-validator";
import { AggregateRootDto } from "../../shared/aggregate-root.dto";


export class CreateMovementDto extends AggregateRootDto{

    @IsInt({message:"Id do inventário deve ser int"})
    @IsPositive({message:"Id do inventário deve ser positivo"})
    @IsNotEmpty({message:"Id do inverátio não deve ser vazio"})
    inventory_id:number;
    
    @IsInt({message:"Id do inventário deve ser int"})
    @IsPositive({message:"Id do inventário deve ser positivo"})
    @NotEquals(0,{message:"Id do inventário não deve ser 0"})
    quantity: number;

}