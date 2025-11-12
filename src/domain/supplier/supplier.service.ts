import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import SupplierRepository from './supplier.repository';
import { FilterDto } from '../shared/filter-dto';

@Injectable()
export class SupplierService {

  constructor(private readonly supplierRepository:SupplierRepository){}

  async create(dto: CreateSupplierDto) {
    let existSupplier = await this.supplierRepository.existsBy({name: dto.name})
    if(existSupplier) throw new BadRequestException(`Já existe um fornecedor com esse nome`);
    existSupplier = await this.supplierRepository.existsBy({cnpj: dto.cnpj})
    if(existSupplier) throw new BadRequestException(`Já existe um fornecedor com esse CNPJ`);
      existSupplier = await this.supplierRepository.existsBy({phone: dto.phone})
    if(existSupplier) throw new BadRequestException(`Já existe um fornecedor com esse Telefone`);

    const supplier = this.supplierRepository.create(dto)
    return await this.supplierRepository.save(supplier);
  }

  async findAll(filter?:FilterDto) {
    return await this.supplierRepository.filterAll(filter);
  }

  async findOne(id: number) {
    const supplier = await await this.supplierRepository.findOneBy({id});
    if(!supplier) throw new NotFoundException('Fornecedor não encontrado')
    return supplier;
  }

  async update(id: number, dto: UpdateSupplierDto) {
    let existSupplier = false;

    const supplier = await this.findOne(id);
    if(!supplier) throw new NotFoundException(`Fornecedor com id ${id} não encontrado`);

    if (supplier.name !== dto.name) {
      existSupplier = await this.supplierRepository.existsBy({name: dto.name})
      if(existSupplier) throw new BadRequestException(`Já existe um fornecedor com esse nome`);
    }
      
    if (supplier.cnpj !== dto.cnpj) {
      existSupplier = await this.supplierRepository.existsBy({cnpj: dto.cnpj})
      if(existSupplier) throw new BadRequestException(`Já existe um fornecedor com esse CNPJ`);
    }
      
    if (supplier.phone !== dto.phone) {
      existSupplier = await this.supplierRepository.existsBy({phone: dto.phone})
      if(existSupplier) throw new BadRequestException(`Já existe um fornecedor com esse Telefone`);
    }

    const updatedSupplier = this.supplierRepository.merge(supplier,dto);
    return await this.supplierRepository.save(updatedSupplier)
  }
}
