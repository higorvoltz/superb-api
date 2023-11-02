import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponse } from './interfaces/users-login.interface';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { IsMineGuard } from 'src/common/guards/is-mine.guard';

@Controller('users')
export class UserController {
  // inject users service
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    // call users service method to register new user
    return this.userService.registerUser(createUserDto);
  }

  @Public()
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    // call users service method to login user
    return this.userService.loginUser(loginUserDto);
  }

  // @Get('me')
  // me(@Request() req: ExpressRequestWithUser): UserPaload {
  //   return req.user;
  // }

  @Patch(':id')
  @UseGuards(IsMineGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // call users service method to update user
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(IsMineGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    // call users service method to delete user
    return this.userService.deleteUser(+id);
  }
}
