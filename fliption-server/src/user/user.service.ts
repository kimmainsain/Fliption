import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SALT_OR_ROUNDS } from '../constants/constants';
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

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  async validateUser(user: User, enteredPassword: string) {
    const isPasswordMatch = await bcrypt.compare(
      enteredPassword,
      user.password,
    );
    if (!isPasswordMatch) return null;
    const { password, ...result } = user;
    return result;
  }
}
