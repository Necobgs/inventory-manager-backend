import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";


@Entity({name:'suppliers'})
export class Supplier extends AggregateRoot{

    @Column()
    name:string;

    @Column()
    cnpj:string;

    @Column()
    phone:string;

}