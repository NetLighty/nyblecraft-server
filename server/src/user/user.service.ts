import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './user.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FilesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async deleteUser(userEmail: string) {
    await this.userRepository.destroy({
      where: {
        email: userEmail,
      },
    });
  }

  async setUserImage(userEmail: string, image: Express.Multer.File) {
    const imageName = await this.fileService.createImage(image);
    await this.userRepository.update(
      { image: imageName },
      { where: { email: userEmail } },
    );
  }

  async createPDF(userEmail: string) {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (user && user.image) {
      const chunks: Buffer[] = [];
      this.fileService.buildPDF(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          imageName: user.image,
        },
        async (chunk) => {
          chunks.push(chunk);
        },
        async () => {
          const pdfData = Buffer.concat(chunks);
          await this.userRepository.update(
            { pdf: pdfData },
            { where: { email: userEmail } },
          );
        },
      );
      return JSON.stringify(true);
    } else {
      return JSON.stringify(false);
    }
  }

  async editUserFirstName(userEmail: string, newFirstName: string) {
    await this.userRepository.update(
      { firstName: newFirstName },
      { where: { email: userEmail } },
    );
  }

  async editUserLastName(userEmail: string, newLastName: string) {
    await this.userRepository.update(
      { lastName: newLastName },
      { where: { email: userEmail } },
    );
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async updateRtHash(email: string, rt: string) {
    const hash = await bcrypt.hash(rt, 6);
    await this.userRepository.update({ hashedRt: hash }, { where: { email } });
  }

  async cleanRtHash(userEmail: string) {
    await this.userRepository.update(
      { hashedRt: null },
      { where: { email: userEmail } },
    );
  }
}
