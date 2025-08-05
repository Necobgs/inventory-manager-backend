import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "./base-entity";


export abstract class AggregateRoot extends BaseEntity{

    @CreateDateColumn({
        type:'time with time zone',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at:Date;

    @UpdateDateColumn({
        type:'time with time zone',
        default:()=> 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updated_at:Date;
}