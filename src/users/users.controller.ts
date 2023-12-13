import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseHandler } from 'src/util/response-handler';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseHandle: ResponseHandler,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res: any) {
    return this.responseHandle.handle(
      res,
      this.usersService.create(createUserDto),
      HttpStatus.CREATED,
      'Berhasil membuat user',
    );
  }

  @Get()
  findAll(@Res() res: any) {
    return this.responseHandle.handle(
      res,
      this.usersService.findAll(),
      HttpStatus.OK,
      'User yang terdaftar',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: any) {
    return this.responseHandle.handle(
      res,
      this.usersService.findOne(id),
      HttpStatus.OK,
      'User yang dicari',
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: any,
  ) {
    return this.responseHandle.handle(
      res,
      this.usersService.update(id, updateUserDto),
      HttpStatus.OK,
      'Berhasil mengubah user',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: any) {
    return this.responseHandle.handle(
      res,
      this.usersService.remove(id),
      HttpStatus.OK,
      'Berhasil menghapus user',
    );
  }
}
