import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, Logger, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const { method, url }: Request = context.switchToHttp().getRequest();
    const requestStart = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode }: Response = context.switchToHttp().getResponse();
        const duration = Date.now() - requestStart;
        this.logger.log(`Request to ${url} via ${method} takes ${duration}ms and returns ${statusCode}`);
      }),
      catchError((error) => {
        if(error instanceof InternalServerErrorException) this.logger.error('Something went wrong', error.stack)
        return throwError(() => error); // return the error as is
      })
    )
  }
}