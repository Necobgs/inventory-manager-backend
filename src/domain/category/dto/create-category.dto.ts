import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AggregateRootDto } from "../../shared/aggregate-root.dto";


export class CreateCategoryDto extends AggregateRootDto{

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsOptional()
    @IsBoolean()
    enabled:boolean;

    @IsOptional()
    @IsString()
    title:string;

    @IsOptional()
    @IsString()
    color:string;

}