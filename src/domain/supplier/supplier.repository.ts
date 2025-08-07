import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { Supplier } from "./entities/supplier.entity";
import { DataSource } from "typeorm";


@Injectable()
export default class SupplierRepository extends BaseRepository<Supplier>{
    constructor(dataSource:DataSource){
        super(Supplier,dataSource)
    }
}