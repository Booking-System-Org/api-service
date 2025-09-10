import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { RestaurantEntity } from './restraunt.entity';
import { DataSource, FindManyOptions } from 'typeorm';
import { Transactional } from 'src/common/types';
import { getRepository } from 'src/common/helpers';

@Injectable()
export class RestaurantRepository {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly datasource: DataSource,
  ) {
    this.logger = new Logger(RestaurantRepository.name);
  }

  async findAndCountAll(
    options: FindManyOptions<RestaurantEntity>,
    { queryRunner: activeQueryRunner }: Transactional = {},
  ): Promise<[RestaurantEntity[], number]> {
    try {
      const restaurantRepository = getRepository(activeQueryRunner ?? this.datasource, RestaurantEntity);
      return restaurantRepository.findAndCount(options);
    } catch (error) {
      this.logger.error(error.message);
      return [[], 0];
    }
  }

}
