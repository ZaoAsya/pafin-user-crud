import {
  CallHandler,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserNotFoundInterceptor } from '../userNotFound.interceptor';
import { UsersService } from '../../routes/users/users.service';

import { mockUser } from '../../../test/constants';

export class MockUserNotFoundInterceptor extends UserNotFoundInterceptor {
  constructor(private service: UsersService) {
    super(service);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const { id } = context.switchToHttp().getRequest().params;

    console.log(id, mockUser.id);
    if (id !== mockUser.id) {
      throw new NotFoundException();
    }

    return next.handle();
  }
}
