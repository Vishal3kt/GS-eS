import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  ReactiveFormsModule
} from '@angular/forms';
import { ConfirmedValidator } from '../confirmpassword.validator';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  forgotpwd: any = FormGroup;
  enterotp: any = FormGroup;
  enteremail: any = FormGroup;
  success: boolean = false;
  submitted: boolean = false;
  intialVal: boolean = true;
  otpVal: boolean = false;
  cnfirmpassVal: boolean = false;
  match: boolean = false;
  inputField: any = FormGroup;
  otplist: any = FormArray;
  submittedotp: boolean = false;
  submittedcpwd: boolean = false;
  userOtp: any;
  updatedpwd: any;
  useremail: any;
  loading:boolean=false;
  get contactFormGroup() {
    return this.enterotp.get('otpfields') as FormArray;
  }
  constructor(public router: Router, 
    public LoaderService:LoaderService,
    public api:ApiService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
     

    this.enteremail = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    }); 
  }

  get f() {
    if (this.intialVal) {
      return this.enteremail.controls;
    }

    
  }
  

   
  submitemail() {
    this.submitted = true;
    if (this.enteremail.invalid) {
      return;
    } else {
      this.loading=true;
      this.useremail = this.enteremail.value.email;
      console.log(this.enterotp.value);
      this.verifyemail(this.useremail);
      
    }
  }

  verifyemail(email:any){
    this.api.tokengeneration().subscribe((restoken:any)=>{   
    this.api.forgotPassword(email).subscribe((res:any)=>{
      console.log(res,"res");
      if(res.value.length==0){
        this.loading=false;
        this.LoaderService.failNotification("User not found.");
      }else{
        this.loading=false;
        this.intialVal=false;
        this.success = true;
      }
    });
  });
  }
   
  finalVal() {
    this.router.navigate(['/login']);
  }
}
