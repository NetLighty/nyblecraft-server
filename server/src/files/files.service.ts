import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as PDFDocument from 'pdfkit';
import { CreatePDFDto } from 'src/files/dto/create-pdf.dto';

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = uuid.v4() + '.' + file.originalname.split('.').pop();
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch {
      throw new HttpException(
        'Error during the file upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async buildPDF(
    userInfo: CreatePDFDto,
    dataCallback: (...args: any[]) => void,
    endCallback: (pdfPath: string) => void,
  ) {
    const imagePath =
      path.resolve(__dirname, '..', 'static') + '\\' + userInfo.imageName;
    const pdfPath = path.resolve(__dirname, '..', `static\\${uuid.v4()}.pdf`);
    const doc = new PDFDocument();
    doc.fontSize(25).text(`${userInfo.firstName} ${userInfo.lastName}`);
    doc.image(imagePath, {
      width: 500,
      align: 'center',
    });
    // doc.setEncoding('binary');
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.on('data', dataCallback);
    doc.on('end', () => endCallback(pdfPath));
    doc.end();
  }
}
