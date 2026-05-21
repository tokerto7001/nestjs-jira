import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import type { CookieOptions, Response } from 'express';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 15 * 60 * 1000,
}

@Controller('auth')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDto, @Res({ passthrough: true }) response: Response) {
    const {
      accessToken,
      refreshToken
    } = await this.authService.signin(body);

    response.cookie('accessToken', accessToken, cookieOptions);
    response.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
}
