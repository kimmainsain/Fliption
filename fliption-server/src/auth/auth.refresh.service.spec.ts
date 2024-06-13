import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService - Refresh Token', () => {
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
            validateRefreshToken: jest.fn(),
            saveRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('유효한 리프레쉬 토큰을 사용하여 액세스 토큰 갱신', async () => {
    const mockUser = {
      username: 'test',
      userId: 1,
      refreshToken: 'valid-refresh-token',
    };
    const refreshToken = 'valid-refresh-token';
    const newAccessToken = 'new-access-token';
    (jwtService.verify as jest.Mock).mockReturnValue({
      username: mockUser.username,
      sub: mockUser.userId,
    });
    (userService.findOne as jest.Mock).mockReturnValue(mockUser);
    (userService.validateRefreshToken as jest.Mock).mockResolvedValue(true);
    (jwtService.sign as jest.Mock).mockReturnValue(newAccessToken);

    const result = await authService.refreshAccessToken(refreshToken);

    expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
      secret: process.env.JWT_SECRET,
    });
    expect(userService.findOne).toHaveBeenCalledWith(mockUser.username);
    expect(userService.validateRefreshToken).toHaveBeenCalledWith(
      mockUser.username,
      refreshToken,
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: mockUser.username,
      sub: mockUser.userId,
    });
    expect(result).toEqual({ accessToken: newAccessToken });
  });

  it('유효하지 않은 리프레쉬 토큰 사용 시 에러 반환', async () => {
    const mockUser = {
      username: 'test',
      userId: 1,
      refreshToken: 'invalid-refresh-token',
    };
    const refreshToken = 'invalid-refresh-token';
    (jwtService.verify as jest.Mock).mockReturnValue({
      username: mockUser.username,
      sub: mockUser.userId,
    });
    (userService.findOne as jest.Mock).mockReturnValue(mockUser);
    (userService.validateRefreshToken as jest.Mock).mockResolvedValue(false);

    await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
      secret: process.env.JWT_SECRET,
    });
    expect(userService.findOne).toHaveBeenCalledWith(mockUser.username);
    expect(userService.validateRefreshToken).toHaveBeenCalledWith(
      mockUser.username,
      refreshToken,
    );
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('만료된 리프레쉬 토큰 사용 시 에러 반환', async () => {
    const refreshToken = 'expired-refresh-token';
    (jwtService.verify as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedException();
    });

    await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
      secret: process.env.JWT_SECRET,
    });
    expect(userService.findOne).not.toHaveBeenCalled();
    expect(userService.validateRefreshToken).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
