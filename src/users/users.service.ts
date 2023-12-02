import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createUserDto: CreateUserDto) {
    const { email, name, password, confPassword } = createUserDto;

    if (!email || !name || !password || !confPassword) {
      throw new HttpException('Data tidak lengkap', HttpStatus.BAD_REQUEST);
    }

    const cekUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (cekUser) {
      throw new HttpException('Email sudah terdaftar', HttpStatus.BAD_REQUEST);
    }

    if (password !== confPassword) {
      throw new HttpException('Password tidak sama', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon.hash(password);
    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const cekUSer = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!cekUSer) {
      throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email, name, password, confPassword } = updateUserDto;

    if (!email || !name || !password || !confPassword) {
      throw new HttpException('Data tidak lengkap', HttpStatus.BAD_REQUEST);
    }

    const cekUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const dataLama = cekUser;

    if (!cekUser) {
      throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    if (password !== confPassword) {
      throw new HttpException('Password tidak sama', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon.hash(password);

    const dataBaru = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      dataLama,
      dataBaru,
    };
  }

  async remove(id: string) {
    const cekUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!cekUser) {
      throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
