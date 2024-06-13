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

  async signIn(loginDto: LoginDto): Promise<string> {
    const user = this.userService.findOne(loginDto.username); // 아이디 검증
    if (!user) throw new UnauthorizedException();

    const validatedUser = await this.userService.validateUser(user, loginDto.password); // 패스워드 검증
    if (!validatedUser) throw new UnauthorizedException();
    
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }
}
