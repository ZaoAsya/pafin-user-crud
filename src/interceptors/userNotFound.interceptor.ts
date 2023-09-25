import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../routes/users/users.service';

@Injectable()
export class UserNotFoundInterceptor implements NestInterceptor {
  uuidRex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const { id } = context.switchToHttp().getRequest().params;

    if (!id) {
      throw new BadRequestException('You need to specify user id');
    }

    if (!this.uuidRex.test(id)) {
      throw new BadRequestException('Validation failed (uuid id is expected)');
    }

    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return next.handle();
  }
}
