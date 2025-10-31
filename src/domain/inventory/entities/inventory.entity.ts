import { Category } from "../../category/entities/category.entity";
import { AggregateRoot } from "../../shared/aggregate-root";
import { Supplier } from "../../supplier/entities/supplier.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({name:'inventories'})
export class Inventory extends AggregateRoot{

    @Column()
    title:string;
    
    @Column()
    stock_value:number;
    
    @Column()
    price_per_unity:number;
    
    @Column()
    qty_product:number;
    
    @Column({default:true})
    enabled:boolean;
    
    @Column()
    description:string;
    
    @ManyToOne(() => Category,{eager:true})
    @JoinColumn({name:'category_id'})
    category:Category;

    @ManyToOne(()=> Supplier,{eager:true})
    @JoinColumn({name:'supplier_id'})
    supplier:Supplier;

    @BeforeInsert()
    @BeforeUpdate()
    calculate_stock_value(){
        this.stock_value = this.price_per_unity * this.qty_product;
    }

}