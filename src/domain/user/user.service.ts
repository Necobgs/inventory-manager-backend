import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { FilterDto } from '../shared/filter-dto';
import { Filter } from '../shared/apply-filters';


@Injectable()
export class UserService {

  constructor(private readonly repository:UserRepository){}

  async exists(filter:Filter){
    return await this.repository.filterExists(filter);
  }
  

  async findAll(filter?:FilterDto) {
    return await this.repository.filterAll(filter)
  }

  async findOne(id:number) {
    const user = await await this.repository.findOneBy({id});
    if(!user) throw new NotFoundException('Usuario não encontrado')
    return user;
  }

  async filterOne(filter:Filter) {
    return await this.repository.filterOne(filter);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.exists({ email: dto.email });
    if (emailExists) {
      throw new BadRequestException(`Email ${dto.email} já está sendo utilizado`);
    }

    const user = this.repository.create(dto);

    return await this.repository.save(user);
  }

  async update(id:number,dto:UpdateUserDto){

    const user = await this.findOne(id);
    if(!user) throw new NotFoundException(`Usuário com id ${id} não encontrada`)

    if (user.email !== dto.email) {
      const emailExists = await this.exists({ email: (dto.email ? dto.email : "") });
      if (emailExists) {
        throw new BadRequestException(`Email ${dto.email} já está sendo utilizado`);
      }
    }

    const updatedUser = this.repository.merge(user,dto);
    return await this.repository.save(updatedUser);
  }
}
