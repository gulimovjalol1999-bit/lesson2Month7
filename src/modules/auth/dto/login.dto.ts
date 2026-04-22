import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({default: "gulimovjalol1999@gmail.com"})
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({default: "Abcdef1!"})
  password!: string;
}