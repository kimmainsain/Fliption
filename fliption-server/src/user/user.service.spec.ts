import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('정상적인 회원 아이디, 패스워드가 들어올 경우', () => {
    const user = service.validateUser('admin', 'admin');
    expect(user).toBeDefined();
  });

  it('정상적인 회원 아이디, 비정상적인 패스워드가 들어올 경우', () => {
    const user = service.validateUser('admin', '1234');
    expect(user).toBeNull();
  });

  it('비정상적인 회원 아이디, 패스워드가 들어올 경우', () => {
    const user = service.validateUser('wawawa', 'wawawa');
    expect(user).toBeNull();
  });
});
