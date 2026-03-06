import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  changepasswordform: any = FormGroup;
  submitted = false;
  userDetails: any;
  userDetails1: any;
  username: any;
  constructor(public router: Router, 
    public api:ApiService,
    public LoaderService:LoaderService,
    private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.userDetails=sessionStorage.getItem("loginDetails"); 
    console.log(this.userDetails);  
    if(this.userDetails==undefined||this.userDetails==''||this.userDetails==null){
      this.userDetails=localStorage.getItem("loginDetails");
      this.userDetails1=JSON.parse(this.userDetails);
      console.log(this.userDetails1);
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
  onSubmit() {
    this.submitted = true;
    if (this.changepasswordform.invalid) {
      return;
    }
    if (this.submitted) {
      console.log(this.changepasswordform.value);
      this.changepassword();
    }
  }
  changepassword() {
    // this.api.tokengeneration().subscribe((restoken:any)=>{   
      this.api.forgotPassword(this.changepasswordform.value.Email).subscribe((res:any)=>{
        console.log(res,"res");
        if(res.value.length==0){
          this.LoaderService.failNotification("User not found.");
        }else{
          this.LoaderService.successNotification("Password reset successful. Please login to continue.");
          this.router.navigate(["/Login"]);
        }
      });
    // });
  }

}
