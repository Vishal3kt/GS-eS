import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';   
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

// REMOVED: MatProgressSpinnerModule - not using manual loading anymore

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: any = FormGroup; 
  submitted = false;
  // loading:boolean=false; // DISABLED: Using global loader instead
  savedata: string="session";
  hidePassword = true;
  constructor(public router: Router, 
    private formBuilder: FormBuilder,
    public api:ApiService,public loadingservice:LoaderService) {}
  ngOnInit(): void {
    // alert("Hi I am working.")
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    }); 
  }
  get tempData() {
    return this.loginForm.controls;
  }

  goToHome(){
  this.router.navigate(['/']);
  }

  goToForget(){
     this.router.navigate(['/forgot']);
  }


  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return ;
    }else{
      this.login();
    } 
  }
  login() {
    let username="mkk.ch@3ktechnologies.com";
    // DISABLED: Using global loader instead
    // this.loading=true;
    this.api.tokengeneration().subscribe((resToken:any)=>{
      console.log('Token response:', resToken);
      // Store token in sessionStorage for interceptor to use
      sessionStorage.setItem('token', resToken.access_token);
      console.log('Token stored in sessionStorage:', resToken.access_token);
      
      this.api.generatepassword(this.loginForm.value.email).subscribe((res:any)=>{
        console.log('API Response:', res); 
        console.log('User Password:', this.loginForm.value.password);
        console.log('Stored Password:', res.value[0].new_portalpassword);
        console.log('User Password Trimmed:', this.loginForm.value.password.trim());
        console.log('Stored Password Trimmed:', res.value[0].new_portalpassword.trim());
        console.log('Password Match (Trimmed):', this.loginForm.value.password.trim() == res.value[0].new_portalpassword.trim());
        console.log('Password Match (Case Insensitive):', this.loginForm.value.password.toLowerCase() == res.value[0].new_portalpassword.toLowerCase());
        
        if(res!=undefined){
          if(res.value.length!=0){
         if(this.loginForm.value.password.trim() == res.value[0].new_portalpassword.trim()){
          
          let data={
            email:this.loginForm.value.email,
            token:resToken.access_token,
            Data:res.value
          }
          if(this.savedata=="local"){
            localStorage.setItem("login", "YES");
            localStorage.setItem("loginDetails", JSON.stringify(data));
          }else{
            sessionStorage.setItem("login", "YES");
            sessionStorage.setItem("loginDetails", JSON.stringify(data));
          }
          
          this.router.navigate(["/LoadingComponent"]);
         }else{
          console.log('Password length mismatch:');
          console.log('Entered:', this.loginForm.value.password.trim().length, 'chars');
          console.log('Expected:', res.value[0].new_portalpassword.trim().length, 'chars');
          this.loadingservice.failNotification("Your password is invalid. Please check the password length and try again.");
         }
        }
        else{
          this.loadingservice.failNotification("Your Email Id is invalid. Please try again.");
        }
        }else{
          this.loadingservice.failNotification("Your Email Id is invalid. Please try again.");
        }
       
      });
    })
    
   
  }
  checkValue(event: any){
    console.log(event.checked);
    if(event.checked == true){
      this.savedata="local";
    }else{
      this.savedata="session";
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
export interface AuthUser {
  firstName?: string | undefined;
  lastName?: string | undefined;
  id: string;
  email: string;
}