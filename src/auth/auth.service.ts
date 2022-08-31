import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.ts';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {
    return this.userService.create(body);
  }

  async login(body: LoginDto) {
    const { emailOrPhone, password } = body;
    const userDetail = await this.userService.findByEmailOrPhone(emailOrPhone);
    const matchPassword = await compare(password, userDetail.password);
    if (!matchPassword) throw new UnauthorizedException('Wrong password');

    return this.jwtService.signAsync(
      { id: userDetail.id },
      { secret: process.env.JWT_SECRET },
    );
  }

  async changePassword(userId: string, body: ChangePasswordDto) {
    return this.userService.changePassword(userId, body);
  }

  async resetPassword(body: ResetPasswordDto) {
    return this.userService.resetPassword(body);
  }
}
