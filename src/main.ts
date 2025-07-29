import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { GlobalExceptionFilter } from './common/http-exception.filter.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);


  // ✅ Enable CORS for all origins
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need cookies/auth headers
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties without decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      //transform: true, // Automatically transforms payloads to match the expected types
    }),
  ); //Para uso Global validador
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('API to manage users')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    const port = configService.get<number>('PORT')! || 3000;
    await app.listen(port);
    console.log(`Application started on port ${port}`);
  } catch (error) {
    console.error('Error starting the application:', error.message);
  }
}
bootstrap();
