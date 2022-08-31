import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindAllOrderDto } from './dto/find-all-orders.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: any,
    @Body() body: CreateOrderDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.orderService.create(req.user.id, body);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Order created', payload });
  }

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  async getUserCart(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.orderService.findAll({
      userId: req.user.id,
      isCheckedOut: false,
    });
    return res.status(HttpStatus.OK).json({ isSuccessful: true, payload });
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const payload = await this.orderService.findAll({
      userId: req.user.id,
      isCheckedOut: true,
    });
    return res.status(HttpStatus.OK).json({ isSuccessful: true, payload });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateOrderDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const payload = await this.orderService.update(id, body, image);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Order updated', payload });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.orderService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ isSuccessful: true, message: 'Data deleted' });
  }

  @Post('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(@Body() body: FindAllOrderDto, @Res() res: Response) {
    const payload = await this.orderService.findAll({
      ...body,
      isCheckedOut: true,
    });
    return res.status(HttpStatus.OK).json({ isSuccessful: true, payload });
  }
}
