import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import InventoryRepository from './inventory.repository';
import { FilterDto } from '../shared/filter-dto';
import { CategoryService } from '../category/category.service';
import { SupplierService } from '../supplier/supplier.service';

@Injectable()
export class InventoryService {

  constructor(
    private readonly inventoryRepository:InventoryRepository,
    private readonly categoryService:CategoryService,
    private readonly supplierService:SupplierService
  ){}

  async exists(description){
    return await this.inventoryRepository.existsBy({description})
  }

  async create(dto: CreateInventoryDto) {
    const existsInventory = await this.exists(dto.description);
    const category = await this.categoryService.findOne(dto.category_id);
    const supplier = await this.supplierService.findOne(dto.supplier_id)
    if(existsInventory) throw new BadRequestException(`Inventory ${dto.description} already exists`) 
    const inventory = this.inventoryRepository.create();
    Object.assign(inventory,dto,{category},{supplier})
    return await this.inventoryRepository.save(inventory);
  }

  async findAll(filter:FilterDto) {
    return await this.inventoryRepository.filterAll(filter);
  }

  async findOne(id: number) {
    return await this.inventoryRepository.findOneByOrFail({id});
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.findOneBy({id});
    if(!inventory) throw new NotFoundException(`id ${id} can't be found`)
    if(updateInventoryDto.category_id){
      const category = await this.categoryService.findOne(updateInventoryDto.category_id);
      if(!category) throw new BadRequestException('Category not found');
      inventory.category = category;
    }
    const updatedCateogry = this.inventoryRepository.merge(inventory,updateInventoryDto)
    return this.inventoryRepository.save(updatedCateogry);
  }

  async remove(id: number) {
    return await this.update(id,{enabled:false})
  }
}
