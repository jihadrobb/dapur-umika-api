import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @MinLength(5)
  newPassword: string;
}
