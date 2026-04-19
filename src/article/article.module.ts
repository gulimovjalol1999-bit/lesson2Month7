import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Article } from "./model/article.entity";

@Module({
  imports: [SequelizeModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
