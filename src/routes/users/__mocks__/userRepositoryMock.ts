import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { DeleteResult } from 'typeorm';

import { User } from '../entities/user.entity';
import { mockUser, mockUserList } from '../../../../test/constants';
import { CreateUserDto } from '../dto/createUser.dto';

export const userRepositoryMock = {
  find: jest.fn().mockResolvedValue(mockUserList),
  findOne: jest
    .fn()
    .mockImplementation(
      async (options: FindOneOptions<User>): Promise<User | null> => {
        if ((options.where as any).id === mockUser.id) {
          return mockUser;
        }
        return null;
      },
    ),
  create: jest
    .fn()
    .mockImplementation(
      (user: CreateUserDto): User => ({ ...mockUser, ...user }),
    ),
  save: jest.fn().mockImplementation((user: User): User => user),
  update: jest.fn(),
  delete: jest.fn().mockImplementation((id: string): DeleteResult => {
    const resultList = mockUserList.filter((user) => user.id !== id);
    return { raw: [], affected: mockUserList.length - resultList.length };
  }),
};
