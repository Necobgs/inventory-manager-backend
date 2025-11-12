import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Get } from '@nestjs/common/decorators';
import { Public } from '../shared/public.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  @Get()
  @Public()
  async findAll(){
    return await this.dashboardService.findAll()
  }
}
