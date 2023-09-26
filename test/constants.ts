import { User } from '../src/routes/users/entities/user.entity';
import {
  CallHandler,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserNotFoundInterceptor } from '../src/interceptors/userNotFound.interceptor';
import { UsersService } from '../src/routes/users/users.service';
import { Observable } from 'rxjs';
import { AuthGuard } from '../src/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const mockUserId: string = 'aaa7777a-a777-7a77-777a-777777aa77aa';
export const mockUser: User = {
  id: 'eca4677d-a115-4d36-812c-527797ee57ab',
  name: 'test1',
  email: 'test@test.ru',
  password: 'test',
};
export const mockUserList: User[] = [mockUser];
export const mockAuthHeader =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsIm' +
  'lhdCI6MTY5NTcwMjM1MSwiZXhwIjoxNjk1NzA5NTUxfQ.J0pPfFO0eBXKOEufgEfHJqSIgvSDW' +
  'xuTRugpX9LYIk8';

export class MockUserNotFoundInterceptor extends UserNotFoundInterceptor {
  constructor(private service: UsersService) {
    super(service);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const { id } = context.switchToHttp().getRequest().params;

    if (id !== mockUser.id) {
      throw new NotFoundException();
    }

    return next.handle();
  }
}

export class MockAuthGuard extends AuthGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [_, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token) {
      throw new UnauthorizedException();
    }

    request.user = { username: 'test' };
    return true;
  }
}
