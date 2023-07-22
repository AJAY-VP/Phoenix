import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private authService: AuthService, private router: Router) {
    
  }
  
  ngOnInit(): void {
    this.getCaptcha()
    this.loginForm = this.fb.group({
      email: new UntypedFormControl('',[Validators.required,Validators.maxLength(256),Validators.email]),
      password: new UntypedFormControl('',[Validators.required,Validators.maxLength(256),Validators.minLength(8)]),
      captcha: new UntypedFormControl('',[Validators.required,Validators.maxLength(5),Validators.minLength(5)]),
      //otp: new FormControl('',[Validators.required,Validators.maxLength(8),Validators.minLength(8)])
    })
  }

  onSumbitLogin(){
    console.log("Submit Click")
  }

  onSignUp(){

  }

  getCaptcha(){
    // this.authService.getCaptcha().subscribe(resp => {
    //   console.log("captcha resp",resp)
    // })
  }

  // onGetOtp(){
  //   console.log("getOtp Click")
  // }

}
