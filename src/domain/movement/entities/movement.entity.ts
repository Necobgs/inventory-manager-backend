import { Inventory } from "src/domain/inventory/entities/inventory.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { User } from "src/domain/user/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity({name:'movements'})
export class Movement extends AggregateRoot{

    @ManyToOne(()=> Inventory,{eager:true})
    @JoinColumn()
    inventory:Inventory
    

    @ManyToOne(()=> User,{eager:true})
    @JoinColumn()
    user: User;
    
    @Column()
    quantity: number;
    
    @Column()
    movement_value: number;

    @Column()
    price_at_time: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculate_movement_value(){
        this.movement_value = this.price_at_time * this.quantity
    }

}