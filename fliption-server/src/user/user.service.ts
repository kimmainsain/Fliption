import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: 'admin',
    },
    {
      userId: 2,
      username: 'user',
      password: 'user',
    },
    {
      userId: 3,
      username: 'test',
      password: 'test',
    },
  ];

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  validateUser(loginDto: LoginDto) {
    const user = this.findOne(loginDto.username);
    if (!user || user.password !== loginDto.password) return null;
    const { password, ...result } = user;
    return result;
  }
}
