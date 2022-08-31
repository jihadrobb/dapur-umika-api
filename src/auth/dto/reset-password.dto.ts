import { PartialType } from '@nestjs/mapped-types';
import { ChangePasswordDto } from './change-password.dto';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto extends PartialType(ChangePasswordDto) {
  @IsNotEmpty()
  userId: string;
}
