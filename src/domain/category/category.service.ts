import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import CategoryRepository from './category.repository';
import { FilterDto } from '../shared/filter-dto';

@Injectable()
export class CategoryService {

  constructor(private readonly categoryRepository:CategoryRepository){}

  async create(dto: CreateCategoryDto) {
    let existsCategory = await this.categoryRepository.existsBy({title: dto.title})
    if(existsCategory) throw new BadRequestException(`Já existe uma categoria com essa título`);
    existsCategory = await this.categoryRepository.existsBy({description: dto.description})
    if(existsCategory) throw new BadRequestException(`Já existe uma categoria com essa descrição`);
    existsCategory = await this.categoryRepository.existsBy({color: dto.color})
    if(existsCategory) throw new BadRequestException(`Já existe uma categoria com essa cor`);
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
    let existsCategory = false;

    const category = await this.categoryRepository.findOneBy({id});
    if(!category) throw new NotFoundException(`Categoria com id ${id} não encontrada`);

    if (category.title !== updateCategoryDto.title) {
      existsCategory = await this.categoryRepository.existsBy({title: updateCategoryDto.title})
      if(existsCategory) throw new BadRequestException(`Já existe uma categoria com essa título`) 
    }

    if (category.description !== updateCategoryDto.description) {
      existsCategory = await this.categoryRepository.existsBy({description: updateCategoryDto.description})
      if(existsCategory) throw new BadRequestException(`Já existe uma categoria com essa descrição`)
    }
    
    if (category.color !== updateCategoryDto.color) {
      existsCategory = await this.categoryRepository.existsBy({color: updateCategoryDto.color})
      if(existsCategory) throw new BadRequestException(`Já existe uma categoria com essa cor`)
    }

    const updatedCateogry = this.categoryRepository.merge(category,updateCategoryDto)
    return this.categoryRepository.save(updatedCateogry);
  }
}
