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

  async signIn(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = this.userService.findOne(loginDto.username); // 아이디 검증
    if (!user) throw new UnauthorizedException();

    const validatedUser = await this.userService.validateUser(user, loginDto.password); // 패스워드 검증
    if (!validatedUser) throw new UnauthorizedException();
    
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
    console.log("refresh AccessToken : : : : ", payload);
    // todo
    // DB에 가지고 있는 refreshToken과 비교하는 코드 추가 예정
    return { accessToken: "임시 더미데이터" };
  }
}
