import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Auth } from "./model/auth.entity";
import * as bcrypt from "bcrypt";
import { Article } from "src/article/model/article.entity";

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth) private authModel: typeof Auth) {}

  async register(createAuthDto: CreateAuthDto) {
    const { username, email, password } = createAuthDto;
    const foundedUser = await this.authModel.findOne({
      where: { email },
      raw: true,
    });

    if (foundedUser) throw new BadRequestException("user already exists");

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = +Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 9),
    ).join("");
    return this.authModel.create({
      username,
      email,
      password: hashPassword,
      otp,
    });
  }

  async findAll(): Promise<Auth []> {
    return this.authModel.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: Article }],
    });
  }

  async findOne(id: number): Promise<Auth> {
    const foundedUser = await this.authModel.findByPk(id, {
      attributes: {exclude: ["password"]},
      include: [{model: Article}]
    });
    if (!foundedUser) throw new NotFoundException("User not found");
    return foundedUser;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto): Promise<{message: string}> {
    const foundedUser = await this.authModel.findByPk(id)
    if(!foundedUser) throw new NotFoundException("user not found")
    foundedUser.update(updateAuthDto)
    return {message: "Updated"};
  }

  async remove(id: number): Promise<{message: string}> {
    const foundedUser = await this.authModel.findByPk(id)
    if(!foundedUser) throw new NotFoundException("user not found")
    foundedUser.destroy()
    return {message: "Deleted"};
  }
}
