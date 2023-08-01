import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { SHA256 } from 'crypto-js';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  recaptchaUiKey = environment.RecaptchaUIKey;
  googleRecaptchaToken: string;
  showPassword: boolean = false;
  captchaDone: boolean = false;

  constructor(private fb: UntypedFormBuilder, private authService: AuthService, private router: Router, private commonService: CommonService) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(256), Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(256), Validators.minLength(8)]],
      // captcha: new UntypedFormControl(''),
      otp: new UntypedFormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(8)])
    })
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onCaptchaResolved(e) {
    console.log(e);
    if (e != null) {
      this.googleRecaptchaToken = e;
      this.captchaDone = true;
    }
    else {
      this.captchaDone = false;
    }
  }

  onSumbitLogin() {
    if (this.loginForm.valid && this.captchaDone) {
      const passwordToEncrypt = this.loginForm.value.password;
      // Encrypt the password using SHA256
      const encryptedPassword = SHA256(passwordToEncrypt).toString();
      console.log(encryptedPassword);
      let loginData = {
        loginId : this.loginForm.value.email,
        password: encryptedPassword,
        captchaToken: this.googleRecaptchaToken,
        otp: this.loginForm.value.otp
      }
      this.authService.login(loginData).subscribe(resp => {
        if (resp['status'] == 'success') {
          let message = resp['response'];
          this.router.navigate(['/home/homeApp']);
          this.commonService.callSnackBarMessage(message,'success');
        }
      });
    }
    else{
      this.loginForm.markAllAsTouched();
      this.commonService.callSnackBarMessage('Please fill all the fields','info');
    }
  }

  onSignUp() {
    this.router.navigate(['/auth/signup'])
  }


  onGetOtp() {
    let loginId = this.loginForm.value.email;
    this.authService.getOtp(loginId).subscribe(resp => {
      if (resp['status'] == 'success') {
        let message = resp['response'];
        this.commonService.callSnackBarMessage(message,'success')
      }
    })
  }

}
