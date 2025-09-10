import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restraunt.entity';
import { RestaurantRepository } from './restraunt.repository';
import { RestaurantService } from './restraunt.service';
import { RestaurantController } from './restraunt.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  controllers: [RestaurantController],
  providers: [RestaurantRepository, RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
