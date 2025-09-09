import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { BookingEntity } from './booking.entity';
import { DataSource } from 'typeorm';
import { Transactional } from 'src/common/types';
import { getRepository } from 'src/common/helpers';

@Injectable()
export class BookingRepository {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(BookingEntity)
    private readonly datasource: DataSource,
  ) {
    this.logger = new Logger(BookingRepository.name);
  }

  async findOneById(
    id: string,
    { queryRunner: activeQueryRunner }: Transactional = {},
  ): Promise<BookingEntity | null> {
    try {
      const bookingRepository = getRepository(activeQueryRunner ?? this.datasource, BookingEntity);
      return bookingRepository.findOneBy({
        id,
      });
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async create(
    data: Partial<BookingEntity>,
    { queryRunner: activeQueryRunner }: Transactional = {},
  ): Promise<BookingEntity | null> {
    try {
      const bookingRepository = getRepository(activeQueryRunner ?? this.datasource, BookingEntity);
      const bookingData = bookingRepository.create(data);
      return bookingRepository.save(bookingData);
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}
