import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenType } from './types/tokenType';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async getToken(username: string): Promise<TokenType> {
    return {
      access_token: await this.jwtService.signAsync({ username }),
    };
  }
}
