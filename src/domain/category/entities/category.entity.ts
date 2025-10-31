import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";

@Entity({name:'categories'})
export class Category extends AggregateRoot{

    @Column()
    title:string;

    @Column()
    description:string;

    @Column({default:true})
    enabled:boolean;

    @Column()
    color: string

}