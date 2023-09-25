import { ApiProperty } from '@nestjs/swagger';

export class TokenType {
  @ApiProperty()
  access_token: string;
}
