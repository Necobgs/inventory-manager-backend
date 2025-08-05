import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import CategoryRepository from './category.repository';
import { FilterDto } from '../shared/filter-dto';

@Injectable()
export class CategoryService {

  constructor(private readonly categoryRepository:CategoryRepository){}

  async exists(description){
    return await this.categoryRepository.existsBy({description})
  }

  async create(dto: CreateCategoryDto) {
    const existsCategory = await this.exists(dto.description);
    if(existsCategory) throw new BadRequestException(`Category ${dto.description} already exists`) 
    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }

  async findAll(filter:FilterDto) {
    return await this.categoryRepository.filterAll(filter);
  }

  async findOne(id: number) {
    return await this.categoryRepository.filterOne({id});
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({id});
    if(!category) throw new NotFoundException(`id ${id} can't be found`)
    const updatedCateogry = this.categoryRepository.merge(category,updateCategoryDto)
    return this.categoryRepository.save(updatedCateogry);
  }

  async remove(id: number) {
    return await this.update(id,{enabled:false})
  }
}
