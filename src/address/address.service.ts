import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './entities/address.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
  ) {}

  async create(userId: string, name: string, detail: string) {
    const generatedId = uuidv4();
    await this.addressModel.create({
      id: generatedId,
      userId,
      name,
      detail,
    });

    return this.addressModel.findByPk(generatedId);
  }

  async findAll(userId: string) {
    return this.addressModel.findAll({ where: { userId } });
  }

  async findOne(id: string) {
    return this.addressModel.findByPk(id);
  }

  async update(id: string, payload: { name: string; detail: string }) {
    const address = await this.addressModel.findByPk(id);
    if (!address) throw new NotFoundException('Address not found');

    await this.addressModel.update(payload, { where: { id } });
    return this.addressModel.findByPk(id);
  }

  async remove(id: string) {
    const address = await this.addressModel.findByPk(id);
    if (!address) throw new NotFoundException('Address not found');

    return this, this.addressModel.destroy({ where: { id } });
  }
}
