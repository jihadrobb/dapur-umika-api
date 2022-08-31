import { PartialType } from '@nestjs/mapped-types';
import { ChangePasswordDto } from './change-password.dto';

export class ResetPasswordDto extends PartialType(ChangePasswordDto) {
  userId: string;
}
