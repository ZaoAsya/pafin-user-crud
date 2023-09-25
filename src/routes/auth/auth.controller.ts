import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenType } from './types/tokenType';
import { GetTokenDto } from './dto/getToken.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: 'Get jwt auth token' })
  async getToken(@Body() body: GetTokenDto): Promise<TokenType> {
    return this.authService.getToken(body.username);
  }
}
