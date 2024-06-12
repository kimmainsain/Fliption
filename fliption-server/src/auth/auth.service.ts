import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  validateUser(loginDto: LoginDto) {
    const user = this.userService.validateUser(loginDto);
    console.log('validateUser : : : ', user);
    if (!user) return null;
    return user;
  }

  login(user: LoginDto) {
    console.log('login : : : ', user);
    return user;
  }
}
