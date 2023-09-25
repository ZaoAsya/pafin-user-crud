import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../routes/users/users.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
class UserExistsRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(id: string, args: ValidationArguments) {
    const user = await this.usersService.findOne(id);
    return !!user;
  }

  defaultMessage(args: ValidationArguments) {
    return "User doesn't exist";
  }
}

export function UserExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserExistsRule,
    });
  };
}
