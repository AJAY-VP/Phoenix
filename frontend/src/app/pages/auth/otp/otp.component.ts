import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  otpForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log("inside comp")
    this.otpForm = this.fb.group({
      otp: new FormControl('',[Validators.required,Validators.maxLength(8),Validators.minLength(8)])
    })
  }

  onSumbitOtp(){
    console.log("Submit Click OTP")
  }

  onGetOtp(){
    console.log("get otp")
  }
}
