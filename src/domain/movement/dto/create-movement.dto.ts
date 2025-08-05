import { IsInt, IsNotEmpty, IsPositive, NotEquals } from "class-validator";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";


export class CreateMovementDto extends AggregateRootDto{

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    inventory_id:number;
    
    @IsInt()
    @IsNotEmpty()
    @NotEquals(0)
    quantity: number;

}