import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { UserNotFoundInterceptor } from '../../interceptors/userNotFound.interceptor';

import { CreateUserDto } from './dto/createUser.dto';
import { UserIdDto } from './dto/userIdDto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users data' })
  @ApiOkResponse({ description: 'Got users data' })
  @ApiUnauthorizedResponse({ description: 'Request from unauthorized user' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user data' })
  @UseInterceptors(UserNotFoundInterceptor)
  @ApiOkResponse({ description: 'Got user data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Request from unauthorized user' })
  async findOne(@Param() params: UserIdDto) {
    return await this.userService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ description: 'New user was created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input params' })
  @ApiUnauthorizedResponse({ description: 'Request from unauthorized user' })
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.createUser(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user data' })
  @UseInterceptors(UserNotFoundInterceptor)
  @ApiOkResponse({ description: 'User was updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input params' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Request from unauthorized user' })
  async updateUser(
    @Param() params: UserIdDto,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(params.id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete existed user' })
  @UseInterceptors(UserNotFoundInterceptor)
  @ApiOkResponse({ description: 'User was removed successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Request from unauthorized user' })
  async deleteUser(@Param() params: UserIdDto): Promise<DeleteResult> {
    return await this.userService.deleteUser(params.id);
  }
}
