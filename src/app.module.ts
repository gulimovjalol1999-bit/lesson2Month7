import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Sequelize } from "sequelize";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from "./article/article.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      database: String(process.env.DB_NAME as string),
      password: String(process.env.DB_PASSWORD as string),
      // models: [Auth, Article],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    ArticleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
