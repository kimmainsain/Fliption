import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signIn(loginDto: LoginDto) {
    const user = this.userService.findOne(loginDto.username);
    if (user?.password !== loginDto.password) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }
}
