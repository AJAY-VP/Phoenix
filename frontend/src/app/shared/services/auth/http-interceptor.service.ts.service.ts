// http-interceptor.service.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private commonService: CommonService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add token to the request (modify this according to your token handling mechanism)
    const token = 'YOUR_ACCESS_TOKEN';
    console.log("in interceptor")
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continue with the modified request
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle error responses here
        // You can log the error, show a toast, redirect, etc.
        console.log(error);
        if(error.status == 500 || error.status == 400){
          this.commonService.callSnackBarMessage(error.error.response,'error');
        }
        else if(error.status == 429){
          this.commonService.callSnackBarMessage('Too many requests','error');
        }
        else if(error.status == 422){
          this.commonService.callSnackBarMessage(error.error.response[0].msg,'error');
        }
        else if(error.status == 401){
        }
        else if(error.status == 403){
        }
        // Pass the error to the calling code to handle as needed
        return throwError(error);
      })
    );
  }
}
