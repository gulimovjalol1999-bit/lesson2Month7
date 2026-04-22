import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true
  }))

  const config = new DocumentBuilder()
  .setTitle("Article project")
  .setDescription("Article project for lesson")
  .setVersion("1.0.0")
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api-docs", app, document)

  app.use("/uploads", express.static("uploads"))

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, () => {
    console.log(`Root api for project: http://localhost:${PORT}`);
    console.log(`Root api for swagger: http://localhost:${PORT}/api-docs`);
  });
}
bootstrap();
