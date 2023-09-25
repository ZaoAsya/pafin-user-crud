import { UserExists } from '../../../decorators/userExists';

export class UserExistsDto {
  @UserExists()
  id: string;
}
