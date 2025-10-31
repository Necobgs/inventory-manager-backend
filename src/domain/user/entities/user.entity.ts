import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { hashPassword } from "src/utils/hash-password";
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

    @Column({nullable:false})
    phone: string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await hashPassword(this.password)
    }
}
