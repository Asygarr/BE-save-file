import {
  Controller,
  Res,
  Post,
  Body,
  Req,
  Delete,
  Get,
  HttpStatus,
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
  async login(@Body() LoginDto: LoginDto, @Res() res: any, @Req() req: any) {
    try {
      const user = await this.authService.Login(LoginDto);

      req.session.user = user.id;

      return res.status(HttpStatus.OK).json({
        message: 'Berhasil login',
        data: user,
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('register')
  async register(
    @Body() RegisterUserDto: RegisterUserDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    try {
      const registerUser = await this.usersService.create(RegisterUserDto);

      req.session.user = registerUser.id;

      return res.status(HttpStatus.CREATED).json({
        message: 'Berhasil membuat user',
        data: registerUser,
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
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
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Delete('logout')
  async logout(@Res() res: any, @Req() req: any) {
    try {
      req.session.destroy();

      return res.status(HttpStatus.OK).json({
        message: 'Berhasil logout',
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
