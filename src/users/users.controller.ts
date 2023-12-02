import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: any) {
    try {
      const createUser = await this.usersService.create(createUserDto);

      return res.status(HttpStatus.CREATED).json({
        message: 'Berhasil membuat user',
        data: createUser,
      })
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      })
    }
  }

  @Get()
  async findAll(@Res() res: any) {
    try {
      const users = await this.usersService.findAll();

      return res.status(HttpStatus.OK).json({
        message: 'User yang terdaftar',
        data: users,
      })
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: any) {
    try {
      const user = await this.usersService.findOne(id);

      return res.status(HttpStatus.OK).json({
        message: 'User yang terdaftar',
        data: user,
      })
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      })
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: any) {
    try {
      const updateUser = await this.usersService.update(id, updateUserDto);

      return res.status(HttpStatus.OK).json({
        message: 'Berhasil mengubah user',
        data_lama: updateUser.dataLama,
        data_baru: updateUser.dataBaru,
      })
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: any) {
    try {
      const deleteUser = await this.usersService.remove(id);

      return res.status(HttpStatus.OK).json({
        message: 'Berhasil menghapus user',
        data: deleteUser,
      })
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      })
    }
  }
}
