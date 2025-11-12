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
    let existsUser = false;

    existsUser = await this.exists({ email: dto.email });
    if (existsUser) throw new BadRequestException(`Email ${dto.email} já está sendo utilizado`);

    existsUser = await this.exists({ phone: dto.phone });
    if (existsUser) throw new BadRequestException(`Já existe um usuário com esse Telefone`);

    const user = this.repository.create(dto);
    return await this.repository.save(user);
  }

  async update(id:number,dto:UpdateUserDto){
    let existsUser = false;

    const user = await this.findOne(id);
    if(!user) throw new NotFoundException(`Usuário com id ${id} não encontrada`);

    if (dto.email && user.email !== dto.email) {
      existsUser = await this.exists({ email: dto.email });
      if (existsUser) throw new BadRequestException(`Email ${dto.email} já está sendo utilizado`);
    }

    if (dto.phone && user.phone !== dto.phone) {
      existsUser = await this.exists({ phone: dto.phone });
      if (existsUser) throw new BadRequestException(`Já existe um usuário com esse Telefone`);
    }

    const updatedUser = this.repository.merge(user,dto);
    return await this.repository.save(updatedUser);
  }
}
