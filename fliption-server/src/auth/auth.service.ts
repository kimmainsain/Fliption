import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 로그인
  async signIn(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = this.userService.findOne(loginDto.username); // 아이디 검증
    if (!user) throw new UnauthorizedException();

    const validatedUser = await this.userService.validateUser(user, loginDto.password); // 패스워드 검증
    if (!validatedUser) throw new UnauthorizedException();
    
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION });

    await this.userService.saveRefreshToken(user.username, refreshToken);
    return { accessToken, refreshToken };
  }

  // 액세스 토큰 갱신
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
    const user = this.userService.findOne(payload.username);
    if (!user) throw new UnauthorizedException();

    const isRefreshTokenValid = await this.userService.validateRefreshToken(user.username, refreshToken);
    if (!isRefreshTokenValid) throw new UnauthorizedException();

    const newPayload = { username: user.username, sub: user.userId };
    const newAccessToken = this.jwtService.sign(newPayload);
    return { accessToken: newAccessToken };
  }
}
