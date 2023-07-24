import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

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

  constructor(private fb: FormBuilder, private router: Router, private snack: MatSnackBar, private authService: AuthService) {} // Inject FormBuilder in the constructor

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
        let message = resp['response'];
        if (resp['status'] == 'success') {
          this.snack.open(message, 'Dismiss', {
            duration: 3000,
            panelClass: ['custom-snack-bar-success']
          });
          // this.router.navigate(['/auth/login']);
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
          this.snack.open(error.error.response[0].msg ? error.error.response[0].msg : error.error.response, 'Dismiss', {
            duration: 3000,
            panelClass: ['custom-snack-bar']
          });
      })
    } else {
      this.signupForm.markAllAsTouched();
      this.snack.open('Please fill all the fields', 'Dismiss', {
        duration: 3000,
        panelClass: ['custom-snack-bar-info']
      });
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
