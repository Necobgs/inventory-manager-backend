import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { Category } from "./entities/category.entity";
import { DataSource } from "typeorm";



@Injectable()
export default class CategoryRepository extends BaseRepository<Category>{
    constructor(dataSource:DataSource){
        super(Category,dataSource)
    }
}