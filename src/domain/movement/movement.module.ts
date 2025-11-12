import { Module } from '@nestjs/common';
import { MovementService } from './movement.service';
import { MovementController } from './movement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movement.entity';
import MovementRepository from './movement.repository';
import { UserModule } from '../user/user.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports:[TypeOrmModule.forFeature([Movement]),
  UserModule,
  InventoryModule],
  controllers: [MovementController],
  providers: [MovementService,MovementRepository],
  exports:[MovementService]
})
export class MovementModule {}
