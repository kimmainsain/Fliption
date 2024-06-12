import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
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

  validateUser(username: string, password: string) {
    const user = this.findOne(username);
    console.log(user, password);
    if (user && user.password === password) return user;
    return null;
  }
}
