import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from './enums';

// TODO: should be moved to shared (library)

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurantId: string;

  @Column({ nullable: false, type: 'integer' })
  guestCount: number;

  @Column({ nullable: false, type: 'timestamptz' })
  bookingDate: Date;

  @Column({ nullable: false, type: 'enum', enum: BookingStatus, default: BookingStatus.CREATED })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
