import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { BookingEntity } from './booking.entity';
import { Transactional } from 'src/common/types';
import { BookingRepository } from './booking.repository';
import { CreateBookingDto } from './dtos';

@Injectable()
export class BookingService {
  private readonly logger: Logger;

  constructor(private readonly bookingRepository: BookingRepository) {
    this.logger = new Logger(BookingService.name);
  }

  async getBookingById(id: string, { queryRunner: activeQueryRunner }: Transactional = {}): Promise<BookingEntity> {
    try {
      const result = await this.bookingRepository.findOneById(id, { queryRunner: activeQueryRunner });
      if (!result) {
        throw new NotFoundException('Booking not found');
      }
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async create(
    data: CreateBookingDto,
    { queryRunner: activeQueryRunner }: Transactional = {},
  ): Promise<BookingEntity> {
    try {
      const result = await this.bookingRepository.create(data, {
        queryRunner: activeQueryRunner,
      });
      if (!result) {
        throw new InternalServerErrorException('Failed to create booking');
      }
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
