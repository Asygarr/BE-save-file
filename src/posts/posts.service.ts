import {
  Injectable,
  HttpException,
  HttpStatus,
  Req,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

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

  async createMulti(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    authorId: string,
  ) {
    const { title } = createPostDto;

    const fileurl = files.map((file) => {
      return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    });

    const response = await this.prisma.post.create({
      data: {
        title,
        file: fileurl.join(' , '),
        authorId,
      },
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
    const user = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('Post tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const { title } = updatePostDto;

    const postLama = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!postLama) {
      throw new HttpException('Post tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${
      file.filename
    }`;

    const splitUrl = postLama.file.split('/');
    const fileLama = splitUrl[splitUrl.length - 1];
    const cekDirr = `./public/uploads/${fileLama}`;

    if (fs.existsSync(cekDirr)) {
      fs.unlinkSync(cekDirr);
    }

    const postBaru = await this.prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        file: fileUrl,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      postLama,
      postBaru,
    };
  }

  async updateMulti(
    id: string,
    updatePostDto: UpdatePostDto,
    files: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    const { title } = updatePostDto;

    const postLama = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!postLama) {
      throw new HttpException('Post tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const fileUrl = files.map((file) => {
      return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    });

    const splitUrl = postLama.file.split(' , ');

    splitUrl.map((file) => {
      const splitFile = file.split('/');
      const fileLama = splitFile[splitFile.length - 1];
      const cekDirr = `./public/uploads/${fileLama}`;

      if (fs.existsSync(cekDirr)) {
        fs.unlinkSync(cekDirr);
      }
    });

    const postBaru = await this.prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        file: fileUrl.join(' , '),
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      postLama,
      postBaru,
    };
  }

  async remove(id: string, userIdLogin: string) {
    const cekPost = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (cekPost.authorId !== userIdLogin) {
      throw new HttpException(
        'Anda tidak berhak menghapus post ini',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!cekPost) {
      throw new HttpException('Post tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const splitUrl = cekPost.file.split('/');
    const file = splitUrl[splitUrl.length - 1];
    const cekDirr = `./public/uploads/${file}`;

    if (fs.existsSync(cekDirr)) {
      fs.unlinkSync(cekDirr);
    }

    const deletePost = await this.prisma.post.delete({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return deletePost;
  }

  async removeMulti(id: string, userIdLogin: string) {
    const cekPost = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (cekPost.authorId !== userIdLogin) {
      throw new HttpException(
        'Anda tidak berhak menghapus post ini',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!cekPost) {
      throw new HttpException('Post tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const splitUrl = cekPost.file.split(' , ');

    splitUrl.map((file) => {
      const splitFile = file.split('/');
      const fileLama = splitFile[splitFile.length - 1];
      const cekDirr = `./public/uploads/${fileLama}`;

      if (fs.existsSync(cekDirr)) {
        fs.unlinkSync(cekDirr);
      }
    });

    const deletePost = await this.prisma.post.delete({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          }
        }
      }
    })

    return deletePost;
  }
}
