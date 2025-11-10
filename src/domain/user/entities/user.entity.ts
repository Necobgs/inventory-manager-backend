import { AggregateRoot } from "../../shared/aggregate-root";
import { hashPassword } from "../../../utils/hash-password";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class User extends AggregateRoot{
    
    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column({default:true})
    enabled: boolean;

    @Column({nullable:true})
    phone: string;

    @Column({nullable:true})
    cep: string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await hashPassword(this.password)
    }
}
