import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Swagger documentation configs */
  const config = new DocumentBuilder()
    .setTitle("API's endpoints")
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('user')
    .addTag('photos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.API_ENDPOINT, app, document);

  await app.listen(3000);
}
bootstrap();
