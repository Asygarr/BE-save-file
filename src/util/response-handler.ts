import { Res, HttpStatus, HttpException } from '@nestjs/common';

export class ResponseHandler {
  async handle(
    @Res() res: any,
    data: Promise<any>,
    statusSucces: HttpStatus,
    successMassage: string,
  ) {
    try {
      const result = await data;

      return res.status(statusSucces).json({
        message: successMassage,
        data: result,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
