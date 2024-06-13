import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login') // 로그인
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Public()
  @Post('refresh') // 액세스 토큰 갱신
  async refresh(@Body() refreshToken: { refreshToken: string }) {
    return await this.authService.refreshAccessToken(refreshToken.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('profile') // 프로필 ### 인증이 필요한 API
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('public')
  getPublic() { // 인증이 필요 없는 API
    return 'This is public';
  }
}
