import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus(); 
      const message = exception.getResponse();  
      response.status(status).json({
        message,
        path_url: request.url,
        //error: exception.stack,  // Stack trace for debugging
      });
    } else {
      // If the exception is not an HttpException, handle it as a generic error (a 500 error is assumed)
      const message = exception.message || 'Internal server error';
      response.status(500).json({
        message,
        path_url: request.url,
        //error: exception.stack,  // Stack trace for debugging
      });
    }
  }
}
