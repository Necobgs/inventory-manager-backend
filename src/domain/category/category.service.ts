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
    if(existsCategory) throw new BadRequestException(`Já existe uma categoria com essa descrição`) 
    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }

  async findAll(filter?:FilterDto) {
    return await this.categoryRepository.filterAll(filter);
  }

  async findOne(id: number) {
    const category = await await this.categoryRepository.findOneBy({id});
    if(!category) throw new NotFoundException('Categoria não encontrada')
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({id});
    if(!category) throw new NotFoundException(`Categoria com id ${id} não encontrada`)
    const updatedCateogry = this.categoryRepository.merge(category,updateCategoryDto)
    return this.categoryRepository.save(updatedCateogry);
  }
}
