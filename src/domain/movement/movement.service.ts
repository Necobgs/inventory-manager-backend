import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import MovementRepository from './movement.repository';
import { FilterDto } from '../shared/filter-dto';
import { InventoryService } from '../inventory/inventory.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MovementService {

  constructor(
    private readonly movementRepository:MovementRepository,
    private readonly inventoryService:InventoryService,
    private readonly userService:UserService
  ){}


  async create(dto: CreateMovementDto) {

    const inventory = await this.inventoryService.findOne(dto.inventory_id);
    if (!inventory) {
      throw new NotFoundException(`Item com id ${dto.inventory_id} não encontrado`);
    }

    const user = await this.userService.findOne(dto.user_id);
    if (!user) {
      throw new NotFoundException(`Usuário com id ${dto.user_id} não encontrado`);
    }

    if ((dto.quantity < 0) && (inventory.qty_product < Math.abs(dto.quantity))) {
      throw new BadRequestException('Não há estoque suficiente para efetuar a saída deste item');
    }

    await this.inventoryService.update(inventory.id, {
      qty_product: inventory.qty_product + dto.quantity,
    });

    const movement = this.movementRepository.create(dto);
    movement.price_at_time = inventory.price_per_unity;
    movement.user = user;
    movement.inventory = inventory;

    return await this.movementRepository.save(movement);
  }

  async findAll(filter?:FilterDto) {
    return await this.movementRepository.filterAll(filter);
  }

  async findOne(id: number) {
    return await this.movementRepository.filterOne({id});
  }

  async update(id: number, dto: UpdateMovementDto) {

    const movement = await this.movementRepository.findOneBy({ id });
    if (!movement) {
      throw new NotFoundException(`Movimentação com id ${id} não encontrada`);
    }

    dto.inventory_id = dto.inventory_id === undefined ? movement.inventory.id : dto.inventory_id;
    dto.user_id = dto.user_id === undefined ? movement.user.id : dto.user_id;
    dto.quantity = dto.quantity === undefined ? movement.quantity : dto.quantity;

    const inventory = await this.inventoryService.findOne(dto.inventory_id);
    if (!inventory) {
      throw new NotFoundException(`Item com id ${dto.inventory_id} não encontrado`);
    }

    const user = await this.userService.findOne(dto.user_id);
    if (!user) {
      throw new NotFoundException(`Usuário com id ${dto.user_id} não encontrado`);
    }

    if (movement.inventory?.id === inventory.id) {
      if (movement.quantity !== dto.quantity) {
        let vqty_product = inventory.qty_product - movement.quantity;
        vqty_product += dto.quantity;

        if (vqty_product < 0) {
          throw new BadRequestException('Não há estoque suficiente para movimentar este item');
        }

        await this.inventoryService.update(inventory.id, {
          qty_product: vqty_product,
        });
      }
    }
    else {
      if ((dto.quantity < 0) && (inventory.qty_product < Math.abs(dto.quantity))) {
        throw new BadRequestException('Não há estoque suficiente para efetuar a saída deste item');
      }

      let vqty_product = movement.inventory.qty_product - movement.quantity;

      if (vqty_product < 0) {
        throw new BadRequestException('Não é possível realizar essa movimentação, pois a quantidade do item antigo ficará negativa');
      }

      await this.inventoryService.update(movement.inventory.id, {
        qty_product: vqty_product,
      });

      await this.inventoryService.update(inventory.id, {
        qty_product: inventory.qty_product + dto.quantity,
      });
    }

    const updatedMovement = this.movementRepository.create({
      ...movement,
      ...dto,
      price_at_time: inventory.price_per_unity,
      user,
      inventory,
    });

    return await this.movementRepository.save(updatedMovement);
  }

  async remove(id: number) {

    const movement = await this.movementRepository.findOneBy({id});
    if(!movement) throw new NotFoundException(`Movimentação com id ${id} não encontrada`)

    const inventory = await this.inventoryService.findOne(movement.inventory.id);
      if (!inventory) {
      throw new NotFoundException(`Item com id ${movement.inventory.id} não encontrado`);
    }

    let vqty_product = inventory.qty_product - movement.quantity;

    if (vqty_product < 0) {
      new BadRequestException(`Não há estoque suficiente para excluir essa movimentação`);
    }

    await this.inventoryService.update(inventory.id,{qty_product: vqty_product});
    return await this.movementRepository.remove(movement)
  }
}
