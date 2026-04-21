// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { CreateArticleDto } from './dto/create-article.dto';
// import { UpdateArticleDto } from './dto/update-article.dto';
// import { InjectModel } from '@nestjs/sequelize';
// import { Article } from './entity/article.entity';

// @Injectable()
// export class ArticleService {
//   constructor(@InjectModel(Article) private articleModel: typeof Article) {}
//   async create(createArticleDto: CreateArticleDto) {
//     return await this.articleModel.create({...createArticleDto});
//   }

//   async findAll(): Promise<Article[]> {
//     return await this.articleModel.findAll();
//   }

//   async findOne(id: number): Promise<Article>  {
//     const foundedArticle = await this.articleModel.findByPk(id)
//     if(!foundedArticle) throw new NotFoundException("article not found")
//     return foundedArticle;
//   }

//   async update(id: number, updateArticleDto: UpdateArticleDto): Promise<{message: string}> {
//     const foundedArticle = await this.articleModel.findByPk(id)
//     if(!foundedArticle) throw new NotFoundException("article not found")
//     await foundedArticle.update(updateArticleDto)
//     return {message: `Updated`};
//   }

//   async remove(id: number): Promise<{message: string}> {
//     const foundedArticle = await this.articleModel.findByPk(id)
//     if(!foundedArticle) throw new NotFoundException("article not found")
//     await foundedArticle.destroy()
//     return {message: "Deleted"};
//   }
// }
