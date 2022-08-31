import { IsEmail, MinLength } from 'class-validator';
export class RegisterDto {
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  @MinLength(11)
  phone: string;

  @MinLength(5)
  password: string;
}
