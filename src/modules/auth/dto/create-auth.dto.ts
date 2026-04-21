import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @MinLength(3, {message: "kamida 3ta harf bolishi kerak"})
  @MaxLength(50, {message: "50tadan kop bolmasligi kerak"})
  username!: string;
  
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  password!: string;
}
