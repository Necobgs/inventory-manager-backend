import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";


export class CreateInventoryDto extends AggregateRootDto{

    @IsNotEmpty()
    @IsString()
    title:string;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price_per_unity:number;
    
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    qty_product:number;
    
    @IsOptional()
    @IsBoolean()
    enabled:boolean;
    
    @IsNotEmpty()
    @IsString()
    description:string;
    
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    category_id:number;
    
}