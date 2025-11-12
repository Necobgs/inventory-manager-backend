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

  async create(dto: CreateInventoryDto) {
    let existsInventory = false;
    
    const category = await this.categoryService.findOne(dto.category_id);
    if(!category) throw new BadRequestException('Categoria informada não encontrada');
    
    const supplier = await this.supplierService.findOne(dto.supplier_id)
    if(!supplier) throw new BadRequestException('Fornecedor informado não encontrado');

    existsInventory = await this.inventoryRepository.existsBy({title: dto.title});
    if(existsInventory) throw new BadRequestException(`Já existe um item com essa título`);

    existsInventory = await this.inventoryRepository.existsBy({description: dto.description});
    if(existsInventory) throw new BadRequestException(`Já existe um item com essa descrição`);
    
    const inventory = this.inventoryRepository.create();
    Object.assign(inventory,dto,{category},{supplier})
    
    return await this.inventoryRepository.save(inventory);
  }

  async findAll(filter?:FilterDto) {
    return await this.inventoryRepository.filterAll(filter);
  }

  async findOne(id: number) {
    const inventory = await await this.inventoryRepository.findOneBy({id});
    if(!inventory) throw new NotFoundException('Item não encontrado')
    return inventory;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    let existsInventory = false;

    const inventory = await this.inventoryRepository.findOneBy({id});
    if(!inventory) throw new NotFoundException(`Item com id ${id} não encontrado`);

    if (updateInventoryDto.category_id) {
      const category = await this.categoryService.findOne(updateInventoryDto.category_id);
      if(!category) throw new BadRequestException('Categoria informada não encontrada');
      inventory.category = category;
    }

    if (updateInventoryDto.supplier_id) {
      const supplier = await this.supplierService.findOne(updateInventoryDto.supplier_id);
      if(!supplier) throw new BadRequestException('Fornecedor informado não encontrado');
      inventory.supplier = supplier;
    }

    if (updateInventoryDto.title && inventory.title !== updateInventoryDto.title) {
      existsInventory = await this.inventoryRepository.existsBy({title: updateInventoryDto.title});
      if(existsInventory) throw new BadRequestException(`Já existe um item com essa título`);
    }

    if (updateInventoryDto.description && inventory.description !== updateInventoryDto.description) {
      existsInventory = await this.inventoryRepository.existsBy({description: updateInventoryDto.description});
      if(existsInventory) throw new BadRequestException(`Já existe um item com essa descrição`);
    }

    const updatedCateogry = this.inventoryRepository.merge(inventory,updateInventoryDto);
    return this.inventoryRepository.save(updatedCateogry);
  }

  async remove(id: number) {
    return await this.update(id,{enabled:false})
  }
}
