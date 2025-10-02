/* eslint-disable @typescript-eslint/require-await */
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async testError(a: any): Promise<number> {
    if(a > 1){
      console.log('No error');
      return 2;
    }

    console.log('This is a test log from AuthService');
    throw new Error('This is a test error from AuthService');
  }

  async register(registerDto: RegisterDto) {
    const userExist: User | null = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    this.testError(1);
    if (userExist) throw new ConflictException('Email already registered');

    const hashed: string = await bcrypt.hash(registerDto.password, 10);
    const user: User = await this.prisma.user.create({
      data: { ...registerDto, password: hashed },
    });

    return {
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      access_token: token,
    };
  }
}
