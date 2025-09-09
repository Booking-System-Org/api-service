import { BookingEntity } from './booking.entity';
import { CreateBookingDto } from './dtos';

export class CreateBookingRequest extends CreateBookingDto {}
export type CreateBookingResponse = BookingEntity;


export type GetBookingByIdResponse = BookingEntity;
