// import { Article } from "src/article/model/article.entity";

import { BaseEntity } from "src/database/entities/base.entity";
import { RolesUser } from "src/shared/enums/roles.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "auth"})
export class Auth extends BaseEntity {

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({type: "enum", enum: RolesUser, default: RolesUser.USER})
  role!: RolesUser;

  @Column({nullable: true})
  otp?: string;

  @Column({type: "bigint", nullable: true})
  otpTime?: number;
}
