import { Inventory } from "../../inventory/entities/inventory.entity";
import { AggregateRoot } from "../../shared/aggregate-root";
import { User } from "../../user/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity({name:'movements'})
export class Movement extends AggregateRoot{

    @ManyToOne(()=> Inventory,{eager:false})
    @JoinColumn({name:'inventory_id'})
    inventory:Inventory
    

    @ManyToOne(()=> User,{eager:false})
    @JoinColumn({name:'user_id'})
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