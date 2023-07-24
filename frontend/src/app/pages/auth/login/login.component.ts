import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private fb: UntypedFormBuilder, private authService: AuthService, private router: Router, private snack: MatSnackBar) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(256), Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(256), Validators.minLength(8)]],
      // captcha: new UntypedFormControl(''),
      otp: new UntypedFormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)])
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
      this.authService.login(this.googleRecaptchaToken).subscribe(resp => {
        let message = resp['response'];
        if (resp['status'] == 'success') {
          this.snack.open(message, 'Dismiss', {
            duration: 3000,
            panelClass: ['custom-snack-bar-success']
          });
        }
        else {
          this.snack.open(message, 'Dismiss', {
            duration: 3000,
            panelClass: ['custom-snack-bar']
          });
        }
      },
        error => {
          console.log(error);
          this.snack.open(error.error.response, 'Dismiss', {
            duration: 3000,
            panelClass: ['custom-snack-bar']
          });
        })
    }
    else{
      this.loginForm.markAllAsTouched();
      this.snack.open('Please fill all the fields', 'Dismiss', {
        duration: 3000,
        panelClass: ['custom-snack-bar-info']
      });
    }
  }

  onSignUp() {
    this.router.navigate(['/auth/signup'])
  }


  onGetOtp() {
    console.log("getOtp Click")
  }

}
