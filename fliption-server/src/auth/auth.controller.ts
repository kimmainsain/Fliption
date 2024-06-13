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
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() refreshToken: { refreshToken: string }) {
    return await this.authService.refreshAccessToken(refreshToken.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('public')
  getPublic() {
    return 'This is public';
  }
}
