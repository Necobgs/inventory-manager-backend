import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import SupplierRepository from './supplier.repository';
import { FilterDto } from '../shared/filter-dto';

@Injectable()
export class SupplierService {

  constructor(private readonly supplierRepository:SupplierRepository){}

  async create(dto: CreateSupplierDto) {
    const supplier = this.supplierRepository.create(dto)
    return await this.supplierRepository.save(supplier);
  }

  async findAll(filter?:FilterDto) {
    return await this.supplierRepository.filterAll(filter);
  }

  async findOne(id: number) {
    return await this.supplierRepository.findOneByOrFail({id});
  }

  async update(id: number, dto: UpdateSupplierDto) {
    const supplier = await this.findOne(id);
    if(!supplier) throw new NotFoundException(`Fornecedor com id ${id} não encontrado`)
    const updatedSupplier = this.supplierRepository.merge(supplier,dto);
    return await this.supplierRepository.save(updatedSupplier)
  }
}
