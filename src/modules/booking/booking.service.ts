import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { BookingEntity } from './booking.entity';
import { Transactional } from 'src/common/types';
import { BookingRepository } from './booking.repository';
import { CreateBookingDto } from './dtos';
import { KafkaService } from 'src/infra/kafka/kafka.service';
import { CreateBookingEvent } from 'src/infra/kafka/kafka.contracts';
import { ConfigService } from '@nestjs/config';
import { KafkaMessage } from 'src/infra/kafka/types';

@Injectable()
export class BookingService {
  private readonly logger: Logger;

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
  ) {
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

      await this.sendBookingCreatedEvent({
        id: result.id,
        restaurantId: result.restaurantId,
        bookingDate: result.bookingDate,
      });
      this.logger.log(`Kafka event sent for booking ${result.id}`);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private async sendBookingCreatedEvent(bookingData: CreateBookingEvent): Promise<void> {
    const topic = this.configService.getOrThrow<string>('kafka.defaultTopic');
    const message: KafkaMessage = {
        topic,
        // key: bookingData.id,
        value: JSON.stringify({
            eventType: 'BOOKING_CREATED',
            data: bookingData,
            timestamp: new Date().toISOString(),
        }),
        headers: {
            'event-type': 'BOOKING_CREATED',
            'service': 'api-service',
        },
    };

    this.logger.debug(`Sending booking created event to Kafka: ${JSON.stringify(message)}`);
    await this.kafkaService.sendMessage(message);
  }
}
