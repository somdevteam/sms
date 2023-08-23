import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      );
  app.useGlobalPipes(new ValidationPipe());
    const logger = new Logger('Bootstrap');
    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('School Management System')
        .setDescription('SMS API')
        .setVersion('1.0')
        .addTag('/api') // You can add tags to group endpoints
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0',(err, address) => {
      if (err) {
          logger.error(`Failed to start server: ${err}`);
          process.exit(1);
      }
      logger.log(`Server listening on ${address}`);
  });
}
bootstrap();
