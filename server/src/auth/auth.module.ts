import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/auth/strategy';
import { UsersModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  imports: [forwardRef(() => UsersModule), JwtModule.register({})],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
