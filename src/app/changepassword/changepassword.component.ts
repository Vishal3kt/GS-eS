import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../services/notification.service';
 
@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  providers: [NotificationService],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  changepasswordform: any = FormGroup;
  submitted = false;
  userDetails: any;
  userDetails1: any;
  username: any;
  loading: boolean = false;
  intialVal: boolean = true;
  success: boolean = false;
  
  constructor(public router: Router, 
    public api:ApiService,
    public LoaderService:LoaderService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) {}
  ngOnInit(): void {
    this.userDetails=sessionStorage.getItem("loginDetails"); 
    if(this.userDetails==undefined||this.userDetails==''||this.userDetails==null){
      this.userDetails=localStorage.getItem("loginDetails");
      this.userDetails1=JSON.parse(this.userDetails);
      this.username=this.userDetails1.email;
    }else{      
      this.userDetails1=JSON.parse(this.userDetails);
      this.username=this.userDetails1.email;
    }
    this.changepasswordform = this.formBuilder.group({
      Email: [this.username, [Validators.required]]      
      });
  }
  get tempData() {
    return this.changepasswordform.controls;
  }

  finalVal() {
    this.router.navigate(["/Login"]);
  }

  onSubmit() {
    this.submitted = true;
    if (this.changepasswordform.invalid) {
      return;
    }
    if (this.submitted) {
      this.changepassword();
    }
  }
  
  changepassword() {
    this.loading = true;
    this.api.forgotPassword(this.changepasswordform.value.Email).subscribe((res:any)=>{
      this.loading = false;
      if(res.value.length==0){
        this.notificationService.showError("User not found.");
      }else{
        this.notificationService.showSuccess("Password reset successful. Please login to continue.");
        this.success = true;
        this.intialVal = false;
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 2000);
      }
    });
  }

}
