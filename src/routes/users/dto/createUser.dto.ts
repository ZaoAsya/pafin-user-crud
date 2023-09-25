import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'user name' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'user email address' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'user password' })
  password: string;
}
