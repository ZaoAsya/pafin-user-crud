import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
// import { AuthGuard } from '../../guards/auth.guard';
import { UserExistsDto } from './dto/userExists.dto';

@Controller('users')
// @UseGuards(AuthGuard) // or move to method level
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: UserExistsDto) {
    return await this.userService.findOne(params.id);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.createUser(user);
  }

  @Put(':id')
  async updateUser(
    @Param() params: UserExistsDto,
    @Body() user: User,
  ): Promise<User> {
    // async updateUser(@Param('id') id: string, @Body() user: User): Promise<User> {
    return await this.userService.updateUser(params.id, user);
  }

  @Delete(':id')
  async deleteUser(@Param() params: UserExistsDto): Promise<User> {
    // async deleteUser(@Param('id') id: string): Promise<User> {
    //   const user = await this.userService.findOne(id);
    // if (!user) {
    //   throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    // }
    return await this.userService.deleteUser(params.id);
  }
}
