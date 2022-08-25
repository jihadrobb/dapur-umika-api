import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {}

  getHello(): any {
    return { message: 'Dapur umika api is running!' };
  }
}
