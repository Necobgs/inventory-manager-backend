import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,private readonly userService:UserService) {}

  async login(user: any) {
    const payload = { id: user.id, sub: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateUser(dto:SignInDto): Promise<any> {
    const user = await this.userService.filterOne({email:dto.email});

    if(!user) throw new UnauthorizedException('Email ou senha inválidos')
    if (bcrypt.compare(dto.password,user.password)) {
      return { id: user.id, name: user.name};
    }
    return null;
  }
}