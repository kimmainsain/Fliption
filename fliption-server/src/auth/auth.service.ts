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

  signIn(loginDto: LoginDto): string {
    const user = this.userService.findOne(loginDto.username);
    if (user?.password !== loginDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }
}
