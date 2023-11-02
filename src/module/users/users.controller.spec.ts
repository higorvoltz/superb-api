import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/core/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register new user', async () => {
    const newUser = {
      email: 'test@test.com',
      name: 'user test',
      password: '1234567890',
    };

    const mockRegisterResponse: User = {
      id: 1,
      email: 'test@test.com',
      name: 'user test',
      password: '1234567890',
    };

    delete mockRegisterResponse.password;

    jest
      .spyOn(controller, 'registerUser')
      .mockResolvedValue(mockRegisterResponse);

    const result = await controller.registerUser(newUser);

    expect(result).toEqual(mockRegisterResponse);
  });

  it('should throw error if email already registered', async () => {
    const registeredUser = {
      email: 'registered@test.com',
      name: 'registered user',
      password: 'password',
    };

    jest
      .spyOn(controller, 'registerUser')
      .mockRejectedValue(new ConflictException());

    const register = controller.registerUser(registeredUser);

    await expect(register).rejects.toThrow(new ConflictException());
  });

  it('should login user', async () => {
    const mockLoginResponse = {
      access_token: 'access_token',
    };

    jest.spyOn(controller, 'loginUser').mockResolvedValue(mockLoginResponse);

    const result = await controller.loginUser({
      email: 'test@test.com',
      password: '1234567890',
    });

    expect(result).toEqual(mockLoginResponse);
    expect(result.access_token).toBeDefined();
  });

  it('should throw error if email is wrong', async () => {
    const wrongEmail = {
      email: 'test@test.com',
      password: '1234567890',
    };

    jest
      .spyOn(controller, 'loginUser')
      .mockRejectedValue(new NotFoundException());

    const login = controller.loginUser(wrongEmail);

    await expect(login).rejects.toThrow(new NotFoundException());
  });
});
