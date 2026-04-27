import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { ArticleResponseDto } from "./dto/article-response.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { CreateArticleFileDto } from "./dto/article-file.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { RolesGuard } from "src/common/decorators/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesUser } from "src/shared/enums/roles.enum";
import { QueryDto } from "./dto/query.dto";

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @ApiOkResponse({ description: "Created" })
  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateArticleFileDto })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const name = path.parse(file.originalname).name;
          const ext = path.extname(file.originalname);
          const uniqueName = `${name}-${Date.now()}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException("Only image files allowed"), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() createArticleDto: CreateArticleFileDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req 
  ) {
    return this.articleService.create(createArticleDto, file, req.user.id);
  }
 
  @ApiNotFoundResponse({ description: "Article not found" })
  @ApiOkResponse({
    description: "list of articles",
    type: [ArticleResponseDto],
  })
  @HttpCode(200)
  @Get()
  findAll(@Query() queryDto: QueryDto) {
    return this.articleService.findAll(queryDto);
  }

  @ApiNotFoundResponse({ description: "Article not found" })
  @HttpCode(200)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.USER)
  @ApiOkResponse({ description: "Updated" })
  @ApiNotFoundResponse({ description: "Article not found" })
  @HttpCode(200)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @ApiOkResponse({ description: "Deleted" })
  @ApiNotFoundResponse({ description: "Article not found" })
  @HttpCode(200)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleService.remove(+id);
  }
}
