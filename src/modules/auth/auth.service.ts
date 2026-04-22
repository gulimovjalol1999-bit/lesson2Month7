import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { Auth } from "./entities/auth.entity";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import nodemailer from "nodemailer";
import { VerifyDto } from "./dto/verify.dto";
import { JwtService } from "@nestjs/jwt";
import { RolesUser } from "src/shared/enums/roles.enum";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private nodemailer: nodemailer.Transporter;
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService,
  ) {
    this.nodemailer = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gulimovjalol1999@gmail.com",
        pass: process.env.APP_KEY,
      },
    });
  }

  async register(createAuthDto: CreateAuthDto) {
    const { username, email, password } = createAuthDto;
    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (foundedUser) throw new BadRequestException("user already exists");

    const hashPassword = await bcrypt.hash(password, 10);

    const otp = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");

    const time = Date.now() + 120000;

    await this.nodemailer.sendMail({
      from: "gulimovjalol1999@gmail.com",
      to: email,
      subject: "Lesson",
      text: "Test content",
      html: `<b>${otp}</b>`,
    });

    const user = this.authRepo.create({
      username,
      email,
      password: hashPassword,
      otp,
      otpTime: time,
    });

    await this.authRepo.save(user);
    return { message: "Registered" };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (!foundedUser) throw new BadRequestException("Invalid email");

    const isMatch = await bcrypt.compare(password, foundedUser.password);

    if (isMatch) {
      const otp = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      const otpTime = Date.now() + 120000;

      // foundedUser.otp = await bcrypt.hash(otp, 10)
      // foundedUser.otp = otp

      // await this.authRepo.save(foundedUser)

      await this.nodemailer.sendMail({
        to: email,
        subject: "Your otp code",
        html: `<b>${otp}</b>`,
      });

      await this.authRepo.update(foundedUser.id, { otp, otpTime: otpTime });

      return { message: "Please check your email" };
    } else {
      throw new BadRequestException("Wrong password");
    }
  }

  async verify(dto: VerifyDto) {
    const { email, otp } = dto;

    const otpValidation = /^\d{6}$/.test(otp);

    if (!otpValidation) throw new BadRequestException("Invalid otp");

    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (!foundedUser) throw new UnauthorizedException("Email not found");
    if (foundedUser.otp !== otp) throw new BadRequestException("Wrong otp");

    const now = Date.now();

    if (foundedUser.otpTime && now > foundedUser.otpTime)
      throw new BadRequestException("otp expired!");

    await this.authRepo.update(foundedUser.id, { otp: "", otpTime: 0 });

    const payload = {
      username: foundedUser.username,
      role: foundedUser.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
