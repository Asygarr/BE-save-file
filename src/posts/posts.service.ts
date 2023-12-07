import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    createPostDto: CreatePostDto,
    authorId: string,
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const { title } = createPostDto;

    if (!title || !file) {
      throw new HttpException('Data tidak lengkap', HttpStatus.BAD_REQUEST);
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${
      file.filename
    }`;

    const response = await this.prisma.post.create({
      data: {
        title,
        file: fileUrl,
        authorId,
      },
    });

    return response;
  }

  async findAll() {
    const response = await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return response;
  }

  async findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: string) {
    return `This action removes a #${id} post`;
  }
}
