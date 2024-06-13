import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { SALT_OR_ROUNDS } from 'src/constants/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin', SALT_OR_ROUNDS),
    },
    {
      userId: 2,
      username: 'user',
      password: bcrypt.hashSync('user', SALT_OR_ROUNDS),
    },
    {
      userId: 3,
      username: 'test',
      password: bcrypt.hashSync('test', SALT_OR_ROUNDS),
    },
  ];

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async validateUser(loginDto: LoginDto) {
    const user = this.findOne(loginDto.username);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }
}
