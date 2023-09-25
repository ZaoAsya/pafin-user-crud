import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
// import { AuthGuard } from '../../guards/auth.guard';
import { UserIdDto } from './dto/userIdDto';
import { UpdateUserDto } from './dto/updateUser.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserNotFoundInterceptor } from '../../interceptors/userNotFound.interceptor';

@Controller('users')
@ApiTags('users')
// @UseGuards(AuthGuard) // or move to method level
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users data' })
  @ApiOkResponse({ description: 'Got users data' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user data' })
  @UseInterceptors(UserNotFoundInterceptor)
  @ApiOkResponse({ description: 'Got user data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param() params: UserIdDto) {
    return await this.userService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ description: 'New user was created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input params' })
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.createUser(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user data' })
  @UseInterceptors(UserNotFoundInterceptor)
  @ApiOkResponse({ description: 'User was updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input params' })
  @ApiNotFoundResponse({ description: 'User not found' })
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
  async deleteUser(@Param() params: UserIdDto): Promise<User> {
    return await this.userService.deleteUser(params.id);
  }
}
