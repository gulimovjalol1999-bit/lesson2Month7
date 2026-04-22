import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { VerifyDto } from "./dto/verify.dto";
import { LoginDto } from "./dto/login.dto";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: "Ro'yxatdan otish uchun" })
  @ApiBadRequestResponse({ description: "User already exists" })
  @ApiCreatedResponse({ description: "Registered" })
  @HttpCode(201)
  @Post("register")
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @ApiBadRequestResponse({ description: "Invalid email" })
  @ApiBadRequestResponse({ description: "Wrong password" })
  @HttpCode(200)
  @ApiOkResponse({description: "Please check your email"})
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @ApiBadRequestResponse({ description: "Invalid otp" })
  @ApiBadRequestResponse({ description: "Wrong otp" })
  @ApiBadRequestResponse({ description: "Otp expired" })
  @ApiUnauthorizedResponse({ description: "Email not found" })
  @HttpCode(200)
  @Post("verify")
  verify(@Body() dto: VerifyDto) {
    return this.authService.verify(dto);
  }
}
