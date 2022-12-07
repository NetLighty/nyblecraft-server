import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Tokens } from 'src/auth/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<Tokens> {
    const user = await this.validateUser(userDto);
    const tokens = await this.getTokens(user.email);
    await this.userService.updateRtHash(user.email, tokens.refresh_token);
    return tokens;
  }

  async logout(userEmail: string): Promise<boolean> {
    await this.userService.cleanRtHash(userEmail);
    return true;
  }

  async registration(userDto: CreateUserDto): Promise<Tokens> {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 6);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    const tokens = await this.getTokens(user.email);
    await this.userService.updateRtHash(user.email, tokens.refresh_token);
    return tokens;
  }

  async refreshTokens(userEmail: string): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(userEmail);
    if (!user) {
      throw new HttpException(
        `User with this email doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const tokens = await this.getTokens(user.email);
    await this.userService.updateRtHash(user.email, tokens.refresh_token);
    return tokens;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (user) {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({
      message: 'Incorrect email or password',
    });
  }

  async getTokens(email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: 60 * 15, // 15 min
        },
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: 60 * 60 * 24 * 7, // one week
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
