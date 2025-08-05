import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../shared/public.decorator';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    const user = await this.authService.validateUser(signInDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log(user)
    return this.authService.login(user);
  }
}