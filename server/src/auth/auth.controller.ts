import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Tokens } from './types';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() userEmail: string): Promise<boolean> {
    return this.authService.logout(userEmail);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Body() userEmail: string): Promise<Tokens> {
    return this.authService.refreshTokens(userEmail);
  }
}
