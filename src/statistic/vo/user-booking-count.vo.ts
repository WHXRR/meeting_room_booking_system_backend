import { ApiProperty } from '@nestjs/swagger';

export class UserBookingCount {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  bookingCount: number;
}
