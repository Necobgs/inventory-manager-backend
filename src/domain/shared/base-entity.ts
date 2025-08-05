import { 
    PrimaryGeneratedColumn,
    BaseEntity as TypeOrmBaseEntity
 } from "typeorm";


export abstract class BaseEntity extends TypeOrmBaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

}