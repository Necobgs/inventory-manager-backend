import { IsBoolean, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";


export class CreateSupplierDto extends AggregateRootDto{

    @IsNotEmpty()
    @IsString()
    name:string;
    
    @IsNotEmpty()
    @IsString()
    @Length(14,14)
    cnpj:string;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('BR')
    phone:string;

    @IsOptional()
    @IsString()
    cep:string;

    @IsOptional()
    @IsBoolean()
    enabled:boolean;

}