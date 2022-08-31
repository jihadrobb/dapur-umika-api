import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AddressService } from 'src/address/address.service';
import { Address } from 'src/address/entities/address.entity';
import { AddAddressDto } from './dto/add-address.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { compare } from 'bcrypt';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private addressService: AddressService,
  ) {}
  async create(body: RegisterDto) {
    const { name, email, phone, password } = body;

    const checkEmail = await this.userModel.findOne({ where: { email } });
    if (checkEmail) throw new ConflictException('Email is registered');

    const checkPhone = await this.userModel.findOne({ where: { phone } });
    if (checkPhone) throw new ConflictException('Phone number is registered');

    const generatedId = uuidv4();
    const hashedPassword = await hash(password, 10);
    await this.userModel.create({
      id: generatedId,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return this.userModel.findByPk(generatedId, {
      attributes: { exclude: ['password'] },
    });
  }

  async findAll() {
    return this.userModel.findAll({
      include: { model: Address, attributes: ['id', 'name', 'detail'] },
      attributes: { exclude: ['password'] },
    });
  }

  async findOne(id: string) {
    const user = await this.userModel.findByPk(id, {
      include: { model: Address, attributes: ['id', 'name', 'detail'] },
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmailOrPhone(emailOrPhone: string) {
    const checkByEmail = await this.userModel.findOne({
      where: { email: emailOrPhone },
    });
    const checkByPhone = await this.userModel.findOne({
      where: { phone: emailOrPhone },
    });
    if (!checkByEmail && !checkByPhone)
      throw new NotFoundException('User not registered');

    return checkByEmail || checkByPhone;
  }

  async update(id: string, body: UpdateUserDto) {
    const user = await this.userModel.findByPk(id, {
      include: { model: Address },
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.userModel.update(body, { where: { id } });
    return this.userModel.findByPk(id, {
      include: { model: Address, attributes: ['id', 'name', 'detail'] },
      attributes: { exclude: ['password'] },
    });
  }

  async remove(id: string) {
    const user = await this.userModel.findByPk(id, {
      include: { model: Address },
    });
    if (!user) throw new NotFoundException('User not found');

    await Promise.all(
      user.addresses.map((address) => this.addressService.remove(address.id)),
    );
    return this.userModel.destroy({ where: { id } });
  }

  async addAddress(userId: string, body: AddAddressDto) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');

    const { name, detail } = body;
    return this.addressService.create(userId, name, detail);
  }

  async removeAddress(userId: string, addressId: string) {
    const address = await this.addressService.findOne(addressId);
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId)
      throw new UnauthorizedException('Unauthorized');

    return this.addressService.remove(addressId);
  }

  async changePassword(userId: string, body: ChangePasswordDto) {
    const { oldPassword, newPassword } = body;
    const userDetail = await this.userModel.findByPk(userId);
    if (!userDetail) throw new NotFoundException('User not found');

    const matchPassword = await compare(oldPassword, userDetail.password);
    if (!matchPassword) throw new UnauthorizedException('Wrong password');

    const hashedPassword = await hash(newPassword, 10);
    return this.userModel.update(
      { password: hashedPassword },
      { where: { id: userId } },
    );
  }

  async resetPassword(body: ResetPasswordDto) {
    const { userId, newPassword } = body;
    const userDetail = await this.userModel.findByPk(userId);
    if (!userDetail) throw new NotFoundException('User not found');

    const hashedPassword = await hash(newPassword, 10);
    return this.userModel.update(
      { password: hashedPassword },
      { where: { id: userId } },
    );
  }
}
