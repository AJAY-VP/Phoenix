import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getCaptcha(){
    return this.http.get('/api/auth/tokenizer/getCaptcha',{});
  }
}
