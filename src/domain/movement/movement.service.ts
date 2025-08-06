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


  async create(dto: CreateMovementDto, req: Request) {
    const user_id = req.user.id;
    const inventory = await this.inventoryService.findOne(dto.inventory_id);
    if (!inventory) {
      throw new NotFoundException(`Inventário com id ${dto.inventory_id} não encontrado`);
    }
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    if (dto.quantity < 0 && Math.abs(dto.quantity) > inventory.qty_product) {
      throw new BadRequestException('Quantidade solicitada excede o estoque disponível');
    }
    await this.inventoryService.update(inventory.id, {
      qty_product: inventory.qty_product + dto.quantity,
    });
    const movement = this.movementRepository.create(dto);
    movement.user = user;
    movement.price_at_time = inventory.price_per_unity;
    movement.inventory = inventory;
    return await this.movementRepository.save(movement);
  }

  async findAll(filter:FilterDto) {
    return await this.movementRepository.filterAll(filter);
  }

  async findOne(id: number) {
    return await this.movementRepository.filterOne({id});
  }

  async update(id: number, dto: UpdateMovementDto, req: Request) {
    const movement = await this.movementRepository.findOneBy({ id });
    if (!movement) {
      throw new NotFoundException(`Movimentação com id ${id} não encontrada`);
    }

    const inventory = await this.inventoryService.findOne(movement.inventory.id);
    if (!inventory) {
      throw new NotFoundException(`Inventário com id ${movement.inventory.id} não encontrado`);
    }

    const user_id = req.user.id;
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const revertQty = inventory.qty_product - movement.quantity;
    if (revertQty < 0) {
      throw new BadRequestException('Reversão da movimentação resultaria em estoque negativo');
    }

    const newQuantity = dto.quantity ?? movement.quantity;

    if (newQuantity < 0 && Math.abs(newQuantity) > revertQty) {
      throw new BadRequestException('Quantidade solicitada excede o estoque disponível');
    }


    await this.inventoryService.update(inventory.id, {
      qty_product: revertQty + newQuantity,
    });

    const updatedMovement = this.movementRepository.create({
      ...movement,
      ...dto,
      quantity: newQuantity,
      user,
      price_at_time: inventory.price_per_unity,
      inventory,
    });


    return await this.movementRepository.save(updatedMovement);
  }

  async remove(id: number) {
    const movement = await this.movementRepository.findOneBy({id});
    if(!movement) throw new NotFoundException(`id ${id} can't be found`)

    const inventory = await this.inventoryService.findOne(movement.inventory.id);
    await this.inventoryService.update(inventory.id,{qty_product:inventory.qty_product + movement.quantity});
    return await this.movementRepository.remove(movement)
  }
}
