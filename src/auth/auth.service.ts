import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async Login(LoginDto: LoginDto) {
    const { email, password } = LoginDto;

    if (!email || !password) {
      throw new HttpException(
        'Mohon isi terlebih dahulu',
        HttpStatus.BAD_REQUEST,
      );
    }

    const loginUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!loginUser) {
      throw new HttpException('Email tidak terdaftar', HttpStatus.BAD_REQUEST);
    }

    const cekPassword = await argon.verify(loginUser.password, password);

    if (!cekPassword) {
      throw new HttpException('Password salah', HttpStatus.BAD_REQUEST);
    }

    const data = {
      id: loginUser.id,
      email: loginUser.email,
      name: loginUser.name,
    };

    return data;
  }

  async Profile(id: string) {
    if (!id) {
      throw new HttpException('Anda belum login', HttpStatus.BAD_REQUEST);
    }

    const cekUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return cekUser;
  }
}
