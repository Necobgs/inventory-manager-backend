import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { Movement } from "./entities/movement.entity";
import { DataSource } from "typeorm";



@Injectable()
export default class MovementRepository extends BaseRepository<Movement>{
    constructor(dataSource:DataSource){
        super(Movement,dataSource)
    }
}