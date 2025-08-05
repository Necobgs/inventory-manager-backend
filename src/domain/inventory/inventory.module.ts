import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import InventoryRepository from './inventory.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports:[TypeOrmModule.forFeature([Inventory]),CategoryModule],
  controllers: [InventoryController],
  providers: [InventoryService,InventoryRepository],
  exports:[InventoryService],
})
export class InventoryModule {}
