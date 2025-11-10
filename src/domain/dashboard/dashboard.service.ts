import { Injectable } from '@nestjs/common';
import { SupplierService } from '../supplier/supplier.service';
import { InventoryService } from '../inventory/inventory.service';
import { CategoryService } from '../category/category.service';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Category } from '../category/entities/category.entity';
import { Movement } from '../movement/entities/movement.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import { MovementService } from '../movement/movement.service';

interface Data {
    inventory: Inventory[],
    category:  Category[],
    supplier:  Supplier[]
}

@Injectable()
export class DashboardService {

    constructor(
        private readonly supplierService:SupplierService,
        private readonly inventoryService:InventoryService,
        private readonly categoryService: CategoryService,
    ){}

    async findAll() : Promise<Data> {
        
        // Dados para filtragem do Dashboard
        const filter    = { "createdAt": { "$between": ["2023-01-01", "2023-12-31"] } };
        const page      = 1;
        const limit     = 50;
        const filterDto = {filter,page,limit};
        
        // Busca dos dados com a mesma filtragem
        const category  = await this.categoryService.findAll(filterDto);
        const supplier  = await this.supplierService.findAll(filterDto);
        const inventory = await this.inventoryService.findAll(filterDto);

        return {
            category,
            supplier,
            inventory
        }
    }
}