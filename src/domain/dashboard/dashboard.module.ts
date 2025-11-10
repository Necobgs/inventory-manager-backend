import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { InventoryModule } from '../inventory/inventory.module';
import { CategoryModule } from '../category/category.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports:[InventoryModule,CategoryModule,SupplierModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
