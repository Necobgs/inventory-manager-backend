import { Exclude, Expose } from "class-transformer";
import { BaseEntityDto } from "./base-entity.dto";


@Exclude()
export abstract class AggregateRootDto extends BaseEntityDto{

    @Expose()
    createdAt:Date;

    @Expose()
    updatedAt:Date;

}