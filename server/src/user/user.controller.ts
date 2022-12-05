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
import { GetUserDto } from './dto/get-user.dto';
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
  deleteUser(@Body() userEmail: string) {
    return this.usersService.deleteUser(userEmail);
  }

  @Post('/user/image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  uploadUserImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() user: GetUserDto,
  ) {
    console.log(image);
    console.log(user);
    return this.usersService.setUserImage(user.email, image);
  }

  @Post('/user/pdf')
  @HttpCode(HttpStatus.OK)
  createUserPdf(@Body() user: GetUserDto) {
    console.log(user);
    return this.usersService.createPDF(user.email);
  }

  @Patch('/user/lastname')
  editUserLastName(@Body() userEmail: string, newLastName: string) {
    return this.usersService.editUserLastName(userEmail, newLastName);
  }

  @Patch('/user/firstname')
  editUserFirstName(@Body() userEmail: string, newFirstName: string) {
    return this.usersService.editUserFirstName(userEmail, newFirstName);
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  getUser(@Body() userEmail: string) {
    return this.usersService.getUserByEmail(userEmail);
  }

  @Get('/users')
  @HttpCode(HttpStatus.OK)
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
