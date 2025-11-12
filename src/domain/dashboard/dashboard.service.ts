import { Injectable } from '@nestjs/common';
import { SupplierService } from '../supplier/supplier.service';
import { InventoryService } from '../inventory/inventory.service';
import { CategoryService } from '../category/category.service';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Category } from '../category/entities/category.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import { FilterDto } from '../shared/filter-dto';
import { MovementService } from '../movement/movement.service';
import { Movement } from '../movement/entities/movement.entity';

export interface Data {
  inventory: Inventory[];
  category: Category[];
  supplier: Supplier[];
  movement: any[];
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly inventoryService: InventoryService,
    private readonly categoryService: CategoryService,
    private readonly movementService: MovementService
  ) {}

  async findAll(): Promise<Data> {
    // Define as datas (hoje e 7 dias atrás)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    // Formato ISO UTC (ex: 2025-11-12T00:33:03.563Z)
    const formatISO = (date: Date) => date.toISOString();

    // Filtro de data para o dashboard
    const filter = {
      created_at: {
        $between: [formatISO(startDate), formatISO(endDate)],
      },
    };

    const page = 1;
    const limit = 50;
    const filterDto = new FilterDto();

    filterDto.filter = filter;
    filterDto.page = page;
    filterDto.limit = limit;

    // Busca dos dados
    const category  = await this.categoryService.findAll(filterDto);
    const supplier  = await this.supplierService.findAll(filterDto);
    const inventory = await this.inventoryService.findAll(filterDto);
    const movement  = (await this.movementService.findAll(filterDto)).map(({user,...rest})=>rest);

    return {
      category,
      supplier,
      inventory,
      movement
    };
  }
}
