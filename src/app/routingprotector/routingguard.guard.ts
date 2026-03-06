import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingguardGuard implements CanActivate {
  logindetails:any;
  logindetails1:any;
  constructor(public router:Router){ 
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
       this.logindetails= sessionStorage.getItem("login");
       this.logindetails1= localStorage.getItem("login"); 
        if(this.logindetails==null||this.logindetails==undefined||this.logindetails==''){
          if(this.logindetails1==null||this.logindetails1==undefined||this.logindetails1==''){
            this.router.navigate(['/Login'], { queryParams: { returnUrl: state.url }});
            return false;
          }else{
           
            return true;
          }          
        }else{
          return true;
        }
       
     
  } 
  
}
