import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../users.service';

import { User } from '../entities/user.entity';
import {
  mockUser,
  notExistedUserId,
  mockUserList,
} from '../../../../test/constants';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

import { userRepositoryMock } from '../__mocks__/userRepositoryMock';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await userService.findAll();

      expect(result).toEqual(mockUserList);
    });
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      const result = await userService.findOne(mockUser.id);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not exists', async () => {
      const result = await userService.findOne(notExistedUserId);

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create new user with hashed password', async () => {
      const user: CreateUserDto = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      };
      const result = await userService.createUser(user);

      expect(result.id).toEqual(mockUser.id);
      expect(result.name).toEqual(mockUser.name);
      expect(result.email).toEqual(mockUser.email);
      expect(result.password).not.toEqual(mockUser.password);
    });
  });

  describe('updateUser', () => {
    it('should update user info', async () => {
      const user: UpdateUserDto = {
        name: 'new name',
        password: 'new password',
      };
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ ...mockUser, ...user });
      const result = await userService.updateUser(mockUser.id, user);

      expect(result.id).toEqual(mockUser.id);
      expect(result.name).toEqual(user.name);
      expect(result.email).toEqual(mockUser.email);
    });
  });

  describe('deleteUser', () => {
    it('should remove user from db', async () => {
      const result = await userService.deleteUser(mockUser.id);

      expect(result.affected).toBe(1);
    });

    it('should do nothing if user not exists', async () => {
      const result = await userService.deleteUser(notExistedUserId);

      expect(result.affected).toBe(0);
    });
  });
});
