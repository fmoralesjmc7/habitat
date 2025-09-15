import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { httpErrorCodes } from './../../providers/http-client/constants/error-codes';

@Injectable()
export class InterceptorProvider implements HttpInterceptor {

  constructor(public http: HttpClient) { }
  
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(next.handle(request).toPromise()
        .catch((error) => {
          let newError = {};
          if (error instanceof HttpErrorResponse && error.status) {
            newError = httpErrorCodes.internalServerError;
          }
          return throwError(newError).toPromise();
        })
    );
  }

}
