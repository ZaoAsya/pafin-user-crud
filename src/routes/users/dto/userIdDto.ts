import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty({ description: 'user id' })
  id: string;
}
