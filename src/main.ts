import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./exceptions/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Add Swagger for better documentation
  const config = new DocumentBuilder()
    .setTitle("Payment APIs")
    .setDescription("All the SVB Payment APIs available can be found here")
    .setVersion("1.0")
    .addTag("")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
