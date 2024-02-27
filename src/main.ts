import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('Search Engine API')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('SearchEngine')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.NESTJS_PORT);

  console.log('Server listening on port : ' + process.env.NESTJS_PORT);
}
bootstrap();
