import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apigatewayUrl = environment.gatewayUrl;

  constructor(private http: HttpClient) { }

  login(loginDetails){
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    const body = loginDetails;
    return this.http.post(this.apigatewayUrl + 'api/userService/v1/login',{body},{headers});
  }

  registerUser(userDetails){
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    const body = userDetails;
    return this.http.post(this.apigatewayUrl + 'api/userService/v1/registerUser',body,{headers});
  }
}
