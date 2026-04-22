import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from "multer"
import path from "path"
import { CreateArticleFileDto } from './dto/article-file.dto';

@ApiInternalServerErrorResponse({description: "Internal server error"})
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOkResponse({description: "Created"})
  @ApiBody({type: CreateArticleFileDto})
  @HttpCode(201)
  @Post("Create")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${file.originalname}${Date.now()}`
          const ext = path.extname(file.originalname)
          cb(null, `${uniqueSuffix}${ext}`)
        }
      })
    })
  )
  create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() file: Express.Multer.File) {
    return this.articleService.create(createArticleDto, file);
  }

  @ApiNotFoundResponse({description: "Article not found"})
  @ApiOkResponse({
    description: "list of articles",
    type: [ArticleResponseDto]
  })
  @HttpCode(200)
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @ApiNotFoundResponse({description: "Article not found"})
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @ApiOkResponse({description: "Updated"})
  @ApiNotFoundResponse({description: "Article not found"})
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @ApiOkResponse({description: "Deleted"})
  @ApiNotFoundResponse({description: "Article not found"})
  @HttpCode(200)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
