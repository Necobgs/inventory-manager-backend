import { IsBoolean, IsNotEmpty, IsOptional, isString, IsString } from "class-validator";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";


export class CreateCategoryDto extends AggregateRootDto{

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsOptional()
    @IsBoolean()
    enabled:boolean;

}