import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup; // Declare the reactive form group
  recaptchaUiKey = environment.RecaptchaUIKey;
  googleRecaptchaToken: string;
  captchaDone: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private authService: AuthService) {} // Inject FormBuilder in the constructor

  ngOnInit(): void {
    this.createSignupForm();
  }

  createSignupForm(): void {
    // Create the reactive form with form controls and validation rules
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required,Validators.maxLength(256),Validators.minLength(3)]],
      lastName: ['', [Validators.required,Validators.maxLength(256),Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      requestReason: ['', [Validators.required,Validators.maxLength(256),Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      let signUpData = JSON.parse(JSON.stringify(this.signupForm.value));
      signUpData['captchaToken'] = this.googleRecaptchaToken;
      this.authService.registerUser(signUpData).subscribe(resp => {
        if (resp['status'] == 'success') {
          let message = resp['response'];
          this.commonService.callSnackBarMessage(message,'success');
          this.router.navigate(['/auth/login']);
        }
      })
    } else {
      this.signupForm.markAllAsTouched();
      this.commonService.callSnackBarMessage('Please fill all the fields','info')
    }
  }

  onCaptchaResolved(e){
    console.log(e);
    if(e != null){
      this.googleRecaptchaToken = e;
      this.captchaDone = true;
    }
    else{
      this.captchaDone = false;
    }
  }

  goBack() {
    // Add logic to navigate back to the previous page or route
    // Example: Use Angular Router to navigate back
    this.router.navigate(['/auth/login'])
  }
}
