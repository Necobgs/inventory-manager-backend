import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { FilterDto } from '../shared/filter-dto';
import { Public } from '../shared/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query('filter') filter?:FilterDto) {
    return this.userService.findAll(filter).then((users)=>
      users.map(user=>plainToClass(UserDto,user))
    );
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto:CreateUserDto){
    return this.userService.create(dto).then((response)=>
      plainToClass(UserDto,response)
    )
  }

  @Patch(':id')
  async update(@Param("id") id:string, dto:UpdateUserDto){
    return await this.userService.update(+id,dto)
  }

  @Get(':id')
  async findOne(@Param('id') id:string){
    return await this.userService.findOne(+id)
  }
}
