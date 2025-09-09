import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './booking.entity';
import { BookingRepository } from './booking.repository';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  providers: [BookingRepository, BookingService],
  exports: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
