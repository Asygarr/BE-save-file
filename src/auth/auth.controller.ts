import {
  Controller,
  Res,
  Post,
  Body,
  Req,
  Delete,
  Get,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any, @Req() req: any) {
    try {
      const loginUser = await this.authService.Login(loginDto);

      req.session.user = loginUser.id;

      return res.status(HttpStatus.OK).json({
        message: 'Berhasil login',
        data: loginUser,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    try {
      const registerUser = await this.usersService.create(registerUserDto);

      req.session.user = registerUser.id;

      return res.status(HttpStatus.CREATED).json({
        message: 'Berhasil membuat user',
        data: registerUser,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  async profile(@Res() res: any, @Req() req: any) {
    try {
      const idLogin = req.session.user;

      const user = await this.authService.Profile(idLogin);

      return res.status(HttpStatus.OK).json({
        message: 'Anda saat ini sedang login',
        data: user,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('logout')
  async logout(@Res() res: any, @Req() req: any) {
    if (!req.session.user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Anda belum login',
      });
    }

    req.session.destroy((err: any) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: err.message,
        });
      }

      res.clearCookie('sid');

      return res.status(HttpStatus.OK).json({
        message: 'Berhasil logout',
      });
    });
  }
}
