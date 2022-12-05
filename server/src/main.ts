import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT ? process.env.PORT : 3222;
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`port: ${process.env.PORT}`);
  });
}
bootstrap();
