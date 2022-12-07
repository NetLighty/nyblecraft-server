import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as PDFDocument from 'pdfkit';
import { CreatePDFDto } from 'src/files/dto/create-pdf.dto';

@Injectable()
export class FilesService {
  createFolder(folderName: string) {
    const folderPath = path.resolve(__dirname, '..', `static\\${folderName}`);
    fs.mkdirSync(folderPath, { recursive: true });
  }

  async createImage(file: Express.Multer.File): Promise<string> {
    try {
      const imageName = uuid.v4() + '.' + file.originalname.split('.').pop();
      const imagePath = path.resolve(__dirname, '..', 'static\\images');
      if (!fs.existsSync(imagePath)) {
        this.createFolder('images');
      }
      fs.writeFileSync(path.join(imagePath, imageName), file.buffer);
      return imageName;
    } catch {
      throw new HttpException(
        'Error during the file upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async buildPDF(
    userInfo: CreatePDFDto,
    dataCallback: (chunk: Buffer) => void,
    endCallback: () => void,
  ) {
    try {
      const imagePath =
        path.resolve(__dirname, '..', 'static') +
        '\\images\\' +
        userInfo.imageName;
      const pdfName = uuid.v4() + '.pdf';
      const pdfFolderPath = path.resolve(__dirname, '..', 'static\\pdfs');
      if (!fs.existsSync(pdfFolderPath)) {
        this.createFolder('pdfs');
      }
      const doc = new PDFDocument();
      doc.fontSize(25).text(`${userInfo.firstName} ${userInfo.lastName}`);
      doc.image(imagePath, {
        width: 500,
        align: 'center',
      });
      doc.pipe(fs.createWriteStream(pdfFolderPath + '\\' + pdfName));
      doc.on('data', dataCallback);
      doc.on('end', endCallback);
      doc.end();
    } catch {
      throw new HttpException(
        'Error during the pdf creation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
