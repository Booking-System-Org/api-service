import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantService } from './restraunt.service';
import { PaginationDto } from 'src/common/pagination.dto';
import { RestaurantEntity } from './restraunt.entity';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  getRestaurants(@Query() queryData: PaginationDto): Promise<[RestaurantEntity[], number]> {
    return this.restaurantService.getRestaurants(queryData);
  }
}
