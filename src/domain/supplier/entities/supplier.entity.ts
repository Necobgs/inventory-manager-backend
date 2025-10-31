import { AggregateRoot } from "../../shared/aggregate-root";
import { Column, Entity } from "typeorm";


@Entity({name:'suppliers'})
export class Supplier extends AggregateRoot{

    @Column()
    name:string;

    @Column()
    cnpj:string;

    @Column()
    phone:string;
    
    @Column({nullable:true})
    cep:string;

    @Column({default:true})
    enabled:boolean

}