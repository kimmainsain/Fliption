import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';

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
    const loginDto: LoginDto = { username: 'admin', password: 'admin' };
    const user = service.validateUser(loginDto);
    expect(user).toBeDefined();
  });

  it('정상적인 회원 아이디, 비정상적인 패스워드가 들어올 경우', () => {
    const loginDto: LoginDto = { username: 'admin', password: '1234' };
    const user = service.validateUser(loginDto);
    expect(user).toBeNull();
  });

  it('비정상적인 회원 아이디, 패스워드가 들어올 경우', () => {
    const loginDto: LoginDto = { username: 'wawawa', password: 'wawawa' };
    const user = service.validateUser(loginDto);
    expect(user).toBeNull();
  });
});
