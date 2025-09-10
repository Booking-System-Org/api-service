import { Injectable, Logger } from '@nestjs/common';
import { RestaurantRepository } from './restraunt.repository';
import { PaginationDto } from 'src/common/pagination.dto';
import { RestaurantEntity } from './restraunt.entity';

@Injectable()
export class RestaurantService {
  private readonly logger: Logger;

  constructor(
    private readonly restaurantRepository: RestaurantRepository,
  ) {
    this.logger = new Logger(RestaurantService.name);
  }

  async getRestaurants(queryData: PaginationDto): Promise<[RestaurantEntity[], number]> {
    try {
    const { limit, offset } = queryData;
    return this.restaurantRepository.findAndCountAll({
        skip: offset,
        take: limit,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
