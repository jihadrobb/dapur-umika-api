import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AddAddressDto } from './dto/add-address.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/role/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.userService.create(body);
    return res.status(HttpStatus.CREATED).json({
      isSuccessful: true,
      message: 'User created',
      payload,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(@Res({ passthrough: true }) res: Response) {
    const payload = await this.userService.findAll();
    return res.status(HttpStatus.OK).json({
      isSuccessful: true,
      payload,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async findOne(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const payload = await this.userService.findOne(req.user.id);
    return res.status(HttpStatus.OK).json({
      isSuccessful: true,
      payload,
    });
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async update(
    @Req() req: any,
    @Body() body: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.userService.update(req.user.id, body);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data updated', payload });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data deleted' });
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async removeMe(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.userService.remove(req.user.id);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data deleted' });
  }

  @Post('address')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async addAddress(
    @Req() req: any,
    @Body() body: AddAddressDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.addAddress(req.user.id, body);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Address added' });
  }

  @Delete('address/:addressId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async removeAddress(
    @Req() req: any,
    @Param('addressId') addressId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.removeAddress(req.user.id, addressId);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Address deleted' });
  }
}
