import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { SignupDto } from "./dtos/signup.dto";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { SigninDto } from "./dtos/signin.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async signup(signupAttr: SignupDto) {
    const exists = await this.prismaService.user.findFirst({
      where: {
        email: signupAttr.email,
      }
    });
    if (exists) throw new BadRequestException('User already exists.');

    const salt = randomBytes(8).toString('hex');
    const hash = await scrypt(signupAttr.password, salt, 32) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    await this.prismaService.user.create({
      data: {
        email: signupAttr.email,
        password: result,
        name: signupAttr.name
      }
    });
  }

  async signin(signinAttr: SigninDto): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: signinAttr.email
      }
    });
    if (!user) throw new NotFoundException('User not found.');

    const [salt, hash] = user.password.split('.');
    const hashToCompare = await scrypt(signinAttr.password, salt, 32) as Buffer;
    if (hash !== hashToCompare.toString('hex')) throw new BadRequestException('Wrong email or password.');

    const [
      accessToken,
      refreshToken,
    ] = await Promise.all([
      this.signToken(
        user.id,
        {
          secret: process.env.jwtAccessKey,
          expiresIn: '15m',
        },),
      this.signToken(
        user.id,
        {
          secret: process.env.jwtRefreshKey,
          expiresIn: '7d',
        },),
    ])

    // set the refresh token again
    await this.prismaService.user.update({ where: { email: signinAttr.email }, data: { refreshToken } });

    return {
      accessToken,
      refreshToken,
    }
  }

  async refresh(userId: number) {
    const newRefreshToken = await this.signToken(userId, {
      secret: process.env.jwtRefreshKey,
      expiresIn: '7d',
    });
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: newRefreshToken,
      }
    });
    return newRefreshToken;
  }

  private signToken(userId: number, signOptions: JwtSignOptions) {
    return this.jwtService.signAsync(
      {
        userId,
      },
      signOptions
    )
  }
}