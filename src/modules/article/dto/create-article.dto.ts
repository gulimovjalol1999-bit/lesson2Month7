import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsInt, IsString } from "class-validator"
import { Tag } from "src/modules/tag/entities/tag.entity"

export class CreateArticleDto {
  @IsString()
  @ApiProperty({default: "HTML"})
  title!: string

  @IsString()
  @ApiProperty({default: "HTML is cool"})
  content!: string

  @Transform(({ value }) => {
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value === "string") return value.split(",").map(Number);
  return [];
})
  @IsArray()
  @IsInt({each: true})
  @ApiProperty({default: [1, 2, 3]})
  tags!: number[]
}
