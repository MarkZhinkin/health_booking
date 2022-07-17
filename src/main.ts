import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const PORT = process.env.PORT || 8001;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle("Health booking")
        .setDescription("REST API Documentation")
        .setVersion("0.1.0")
        .addBearerAuth(
            {
                description: "Please enter token in following format: Bearer <JWT>",
                name: "Authorization",
                bearerFormat: "Bearer",
                scheme: "Bearer",
                type: "http",
                in: "Header",
            },
            "JWT"
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/docs", app, document, { customSiteTitle: "Health booking API documentation" });

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap();
