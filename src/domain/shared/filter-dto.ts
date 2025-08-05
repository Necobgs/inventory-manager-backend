import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { Filter } from './apply-filters';

export class FilterDto {
  @IsOptional()
  filter: Filter;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => {
    return Number(value);
    
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => {
    return Number(value);
    
  })
  limit: number = 10;
}