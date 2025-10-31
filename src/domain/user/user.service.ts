import { BadRequestException, Injectable } from '@nestjs/common';
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
    return await this.repository.findOneByOrFail({id})
  }

  async filterOne(filter:Filter) {
    return await this.repository.filterOne(filter);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.exists({ email: dto.email });
    if (emailExists) {
      throw new BadRequestException(`Email ${dto.email} already in use`);
    }

    const user = this.repository.create(dto);

    return await this.repository.save(user);
  }

  async update(id:number,dto:UpdateUserDto){
    const user = await this.findOne(id);
    const updatedUser = this.repository.merge(user,dto);
    return await this.repository.save(updatedUser);
  }
}
