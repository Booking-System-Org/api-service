import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingResponse, GetBookingByIdResponse } from './booking.contracts';
import { CreateBookingDto } from './dtos';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetBookingByIdResponse> {
    return this.bookingService.getBookingById(id);
  }

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<CreateBookingResponse> {
    return this.bookingService.create(createBookingDto);
  }
}
