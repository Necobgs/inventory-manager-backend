import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import MovementRepository from './movement.repository';
import { FilterDto } from '../shared/filter-dto';
import { InventoryService } from '../inventory/inventory.service';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Injectable()
export class MovementService {

  constructor(
    private readonly movementRepository:MovementRepository,
    private readonly inventoryService:InventoryService,
    private readonly userService:UserService
  ){}


  async create(dto: CreateMovementDto,req:Request) {
    const user_id = req.user.id;
    const inventory = await this.inventoryService.findOne(dto.inventory_id);
    const user = await this.userService.findOne( user_id ) //Extrair do token jwt
    if(!user) throw new BadRequestException('The user for this movement is not found')
    if(dto.quantity > inventory.qty_product) throw new BadRequestException('The quantity is greater than quantity in inventory')
    await this.inventoryService.update(inventory.id,{qty_product:inventory.qty_product + dto.quantity});
    const movement = this.movementRepository.create(dto);
    movement.user = user;
    movement.price_at_time = inventory.price_per_unity;
    movement.inventory = inventory
    return await this.movementRepository.save(movement);
  }

  async findAll(filter:FilterDto) {
    return await this.movementRepository.filterAll(filter);
  }

  async findOne(id: number) {
    return await this.movementRepository.filterOne({id});
  }

  // async update(id: number, updateMovementDto: UpdateMovementDto) {
  //   const movement = await this.movementRepository.findOneBy({id});
  //   if(!movement) throw new NotFoundException(`id ${id} can't be found`)
  //   const updatedCateogry = this.movementRepository.merge(movement,updateMovementDto)
  //   return this.movementRepository.save(updatedCateogry);
  // }

  async remove(id: number) {
    const movement = await this.movementRepository.findOneBy({id});
    if(!movement) throw new NotFoundException(`id ${id} can't be found`)

    const inventory = await this.inventoryService.findOne(movement.inventory.id);
    await this.inventoryService.update(inventory.id,{qty_product:inventory.qty_product + movement.quantity});
    return await this.movementRepository.remove(movement)
  }
}
