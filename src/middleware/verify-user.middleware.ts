import {
  Injectable,
  NestMiddleware,
  Req,
  Res,
  Next,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {
  async use(@Req() req: any, @Res() res: any, @Next() next: any) {
    const idLogin = req.session.user;

    if (!idLogin) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Anda belum login',
      });
    }

    const cekUser = await prisma.user.findUnique({
      where: {
        id: idLogin,
      },
    });

    if (!cekUser) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Anda belum login',
      });
    }

    next();
  }
}
