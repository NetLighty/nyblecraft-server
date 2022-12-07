import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from 'src/files/files.module';
import { UsersController } from './user.controller';
import { User } from './user.model';
import { UsersService } from './user.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User]), FilesModule],
  exports: [UsersService],
})
export class UsersModule {}
