import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin', parseInt(process.env.SALT_OR_ROUNDS)),
    },
    {
      userId: 2,
      username: 'user',
      password: bcrypt.hashSync('user', parseInt(process.env.SALT_OR_ROUNDS)),
    },
    {
      userId: 3,
      username: 'test',
      password: bcrypt.hashSync('test', parseInt(process.env.SALT_OR_ROUNDS)),
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

  async saveRefreshToken(username: string, refreshToken: string) {
    const user = this.findOne(username);
    if (!user) return;
    user.refreshToken = refreshToken;
  }

  async validateRefreshToken(username: string, refreshToken: string) {
    const user = this.findOne(username);
    return user?.refreshToken === refreshToken;
  }
}
