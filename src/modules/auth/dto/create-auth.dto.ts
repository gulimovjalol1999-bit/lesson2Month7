import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @MinLength(3, {message: "kamida 3ta harf bolishi kerak"})
  @MaxLength(50, {message: "50tadan kop bolmasligi kerak"})
  @ApiProperty({default: "Jaloliddin"})
  username!: string;
  
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({default: "gulimovjalol1999@gmail.com"})
  email!: string;

  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  @ApiProperty({default: "Abcdef1!"}) 
  password!: string;
}
