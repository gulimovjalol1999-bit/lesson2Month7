
import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "article" })
export class Article extends BaseEntity {
  @Column()
  title!: string;

  @Column()
  content!: string;
}
