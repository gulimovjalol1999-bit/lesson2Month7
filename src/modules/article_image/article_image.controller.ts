import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  HttpCode,
} from "@nestjs/common";
import { ArticleImageService } from "./article_image.service";
import { CreateArticleImageDto } from "./dto/create-article_image.dto";
import { UpdateArticleImageDto } from "./dto/update-article_image.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth-guard";
import { RolesGuard } from "src/common/decorators/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesUser } from "src/shared/enums/roles.enum";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { CreateImageDto } from "./dto/create_image.dto";

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("article-image")
export class ArticleImageController {
  constructor(private readonly articleImageService: ArticleImageService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @ApiOkResponse({ description: "Created" })
  @ApiBody({ type: CreateImageDto })
  @HttpCode(201)
  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FilesInterceptor("files", 10, {
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
    @Body() createArticleImageDto: CreateArticleImageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {

    return this.articleImageService.create(createArticleImageDto, files);
  }

  @Get()
  findAll() {
    return this.articleImageService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleImageService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateArticleImageDto: UpdateArticleImageDto,
  ) {
    return this.articleImageService.update(+id, updateArticleImageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleImageService.remove(+id);
  }
}
