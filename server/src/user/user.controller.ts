import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { EditLastNameDto } from './dto/edit-firstname.dto';
import { EditFirstNameDto } from './dto/edit-lastname.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UsersService } from './user.service';

@Controller('/')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/user')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Delete('/user')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Body() user: FindUserDto) {
    return this.usersService.deleteUser(user.email);
  }

  @Post('/user/image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  uploadUserImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
    )
    image: Express.Multer.File,
    @Body() user: FindUserDto,
  ) {
    return this.usersService.setUserImage(user.email, image);
  }

  @Post('/user/pdf')
  @HttpCode(HttpStatus.OK)
  createUserPdf(@Body() userInfo: FindUserDto) {
    return this.usersService.createPDF(userInfo.email);
  }

  @Patch('/user/lastname')
  @HttpCode(HttpStatus.OK)
  editUserLastName(@Body() userInfo: EditLastNameDto) {
    return this.usersService.editUserLastName(
      userInfo.email,
      userInfo.newLastName,
    );
  }

  @Patch('/user/firstname')
  @HttpCode(HttpStatus.OK)
  editUserFirstName(@Body() userInfo: EditFirstNameDto) {
    return this.usersService.editUserFirstName(
      userInfo.email,
      userInfo.newFirstName,
    );
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  getUser(@Body() userInfo: FindUserDto) {
    return this.usersService.getUserByEmail(userInfo.email);
  }

  @Get('/users')
  @HttpCode(HttpStatus.OK)
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
