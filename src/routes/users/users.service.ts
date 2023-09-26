import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  bcryptSaltLength = 10;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const hashedUser = await this.hashUserSecrets(user);
    const newUser = this.userRepository.create(hashedUser);
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const hashedUser = await this.hashUserSecrets(user);
    await this.userRepository.update(id, hashedUser);
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  private async hashUserSecrets(user: UpdateUserDto): Promise<UpdateUserDto> {
    return user.password
      ? {
          ...user,
          password: await bcrypt.hash(user.password, this.bcryptSaltLength),
        }
      : user;
  }
}
