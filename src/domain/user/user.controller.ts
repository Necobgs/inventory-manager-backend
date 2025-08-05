import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { FilterDto } from '../shared/filter-dto';
import { Public } from '../shared/public.decorator';

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
}
