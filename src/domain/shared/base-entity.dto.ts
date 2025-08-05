import { Exclude, Expose } from "class-transformer";


@Exclude()
export abstract class BaseEntityDto{

    @Expose()
    id:number;

}