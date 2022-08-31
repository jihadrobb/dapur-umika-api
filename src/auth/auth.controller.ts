import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto.ts';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const payload = await this.authService.register(body);
    return res.status(HttpStatus.CREATED).json({
      isSuccessful: true,
      message: 'Successfully registered',
      payload,
    });
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const access_token = await this.authService.login(body);
    return res.status(HttpStatus.OK).json({
      isSuccessful: true,
      message: 'Successfully logged in',
      access_token,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('changePassword')
  async changePassword(
    @Req() req: any,
    @Body() body: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.changePassword(req.user.id, body);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Password changed' });
  }

  @Post('resetPassword')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.resetPassword(body);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Password changed' });
  }
}
