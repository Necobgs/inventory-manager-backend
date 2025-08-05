import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { Inventory } from "./entities/inventory.entity";
import { DataSource } from "typeorm";



@Injectable()
export default class InventoryRepository extends BaseRepository<Inventory>{
    constructor(dataSource:DataSource){
        super(Inventory,dataSource)
    }
}