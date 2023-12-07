import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseHandler } from 'src/utils/response-handler';
import { storage } from 'src/configs/multer.config';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly responseHandler: ResponseHandler,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: storage }))
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 10,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const userIdLogin = req.session.user;

    return this.responseHandler.handle(
      res,
      this.postsService.create(createPostDto, userIdLogin, file, req),
      HttpStatus.CREATED,
      'Berhasil Membuat Post',
    );
  }

  @Get()
  findAll(@Res() res: any) {
    return this.responseHandler.handle(
      res,
      this.postsService.findAll(),
      HttpStatus.OK,
      'List semua post',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: any) {
    return this.responseHandler.handle(
      res,
      this.postsService.findOne(id),
      HttpStatus.OK,
      'Post yang di cari',
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Res() res: any,
  ) {
    return this.responseHandler.handle(
      res,
      this.postsService.update(id, updatePostDto),
      HttpStatus.OK,
      'Berhasil mengupdate post',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: any) {
    return this.responseHandler.handle(
      res,
      this.postsService.remove(id),
      HttpStatus.OK,
      'Berhasil menghapus post',
    );
  }
}
