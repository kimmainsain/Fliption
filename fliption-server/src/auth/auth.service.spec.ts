import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            validateUser: jest.fn(),
            saveRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('로그인이 성공적으로 되었을 때 JWT를 제대로 반환하는지 체크', async () => {
    const mockUser = { username: 'test', userId: 1 };
    const loginDto = { username: 'test', password: 'password' };
    (userService.findOne as jest.Mock).mockReturnValue(mockUser);
    (userService.validateUser as jest.Mock).mockResolvedValue(true);
    (jwtService.sign as jest.Mock).mockReturnValue('signed-jwt-token');

    const result = await authService.signIn(loginDto);

    expect(userService.findOne).toHaveBeenCalledWith(loginDto.username);
    expect(userService.validateUser).toHaveBeenCalledWith(
      mockUser,
      loginDto.password,
    );
    expect(userService.saveRefreshToken).toHaveBeenCalledWith(
      loginDto.username,
      'signed-jwt-token',
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: mockUser.username,
      sub: mockUser.userId,
    });
    expect(result).toEqual({ accessToken: 'signed-jwt-token', refreshToken: 'signed-jwt-token' });
  });

  it('유저를 찾을 수 없을 때 에러 반환 체크', async () => {
    const loginDto = { username: 'nonexistent', password: 'password' };
    (userService.findOne as jest.Mock).mockReturnValue(null);

    await expect(authService.signIn(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(userService.findOne).toHaveBeenCalledWith(loginDto.username);
    expect(userService.validateUser).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('올바르지 않은 비밀번호 입력 시 에러 반환 체크', async () => {
    const mockUser = { username: 'test', userId: 1 };
    const loginDto = { username: 'test', password: 'wrongpassword' };
    (userService.findOne as jest.Mock).mockReturnValue(mockUser);
    (userService.validateUser as jest.Mock).mockResolvedValue(false);

    await expect(authService.signIn(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(userService.findOne).toHaveBeenCalledWith(loginDto.username);
    expect(userService.validateUser).toHaveBeenCalledWith(
      mockUser,
      loginDto.password,
    );
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
