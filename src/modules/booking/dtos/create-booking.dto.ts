import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';
import { FutureDate } from 'class-validator-extended';

export class CreateBookingDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public restaurantId: string;

  @IsDefined()
  @IsInt()
  @IsPositive()
  public guestCount: number;

  @IsDefined()
  @IsNotEmpty()
  @IsDate()
  @FutureDate({ message: 'Booking date must be in the future' })
  @Type(() => Date)
  public bookingDate: Date;
}
