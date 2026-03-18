import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL: any;
  constructor(private http: HttpClient,
    public LoaderService: LoaderService,
    public router: Router) {
    this.apiURL = environment.apiUrl1;
  }


  tokengeneration() {
    // if (environment.enableMockLogin) {
    //   return of({
    //     access_token: 'mock-token-123',
    //     token_type: 'Bearer'
    //   });
    // }

    let url = "https://f444d6f8f0da442a8511f51a08108c.09.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/12d81a7811874fcb80fab27eceaf92aa/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bOXqUgMFCo_PxhkokiTek19AsNTgaPV5VTr94meOPnw";
    return this.http.post(url, {});
  }
  generatepassword(username: any) {
    let url = "" + this.apiURL + "api/data/v9.0/contacts?$filter= new_portallogin eq true and emailaddress1 eq" + " " + "'" + username + "'" + " " + "and statuscode eq 1&$select=new_portalpassword,_parentcustomerid_value,fullname";
    console.log(url);
    return this.http.get(url);
  }
  getEntitlement(email: any) {
    let url = "" + this.apiURL + "api/data/v9.0/contacts?$filter= new_portallogin eq true and emailaddress1 eq" + " " + "'" + email + "'" + " " + "and statuscode eq 1&$select=contactid, _parentcustomerid_value";
    console.log(url);
    return this.http.get(url);
  }
  getEntitlementstep2(parentcustomerid_value: any) {
    let url = "" + this.apiURL + "api/data/v9.0/entitlements?$filter= statuscode eq 1 and _customerid_value eq" + " " + "'" + parentcustomerid_value + "'" + "&$select=name,startdate,enddate,totalterms,remainingterms";
    console.log(url);
    return this.http.get(url);
  }
  forgotPassword(email: any) {
    let url = "" + this.apiURL + "api/data/v9.0/contacts?$filter= new_portallogin eq true and emailaddress1 eq" + " " + "'" + email + "'" + " " + "and statuscode eq 1&$select=contactid";
    console.log(url);
    return this.http.get(url);
  }
  
  getProfile(email?: string) {
    const userEmail = email || this.getUserEmail();
    let url = "" + this.apiURL + "api/data/v9.2/contacts?$filter=new_portallogin eq true and emailaddress1 eq '" + userEmail + "' and statuscode eq 1&$select=firstname,lastname,mobilephone,emailaddress1";
    console.log(url);
    return this.http.get(url);
  }
  
  private getUserEmail(): string {
    // Try to get email from localStorage or sessionStorage
    return localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || '3KT@test.com';
  }
  mytickets(email: any, code: any) {
    let url = "" + this.apiURL + "api/data/v9.0/incidents?$filter=kkk_fromemailid eq" + " " + "'" + email + "'" + " " + "and statecode eq " + code + "&$select=createdon,caseorigincode,statecode,ticketnumber,title,casetypecode,prioritycode, _entitlementid_value,statuscode,new_entitlementname,incidentid,kkk_approvedhours,kkk_estimatedhours,new_approvedhours, new_estimatedhours, new_consumedhours, description&$orderby=createdon desc";
    console.log(url);
    return this.http.get(url);
  }
  getentitlementname(entitleid: any) {
    // Only make API call if entitleid is not null or empty
    if (!entitleid || entitleid === 'null' || entitleid === '') {
      console.log('No valid entitlement ID provided for getentitlementname');
      return of({ value: [] });
    }
    
    let url = "" + this.apiURL + "api/data/v9.0/entitlements?$filter= statuscode eq 1 and _customerid_value eq " + entitleid + "&$select=name,entitlementid,_customerid_value";
    console.log('Entitlement API URL:', url);
    return this.http.get(url);
  }

  casecreation(token: any, data: any) {
    let url = "" + this.apiURL + "api/data/v9.0/incidents?$select=incidentid";
    console.log(url);
    return this.http.post(url, data, { responseType: 'blob', observe: 'response' });
  }
  documentupload(token: any, data: any) {
    let url = "" + this.apiURL + "api/data/v9.0/annotations";
    console.log(url);
    return this.http.post(url, data, { responseType: 'blob', observe: 'response' });
  }

  onholdorcancel(incidentid: any, statuscode: any, statecode: any) {
    let url = "https://fb4fccab30bfec1087f97bf0e05e93.10.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/c891aef3fb6f49e2aa7f16f2d4179669/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XeLVKB7naBQ3bkwHR7iWMrxBIKx7CxUEi832EdZX-H8&incidentiq=" + incidentid + "&statuscode=" + statuscode + "&statecode=" + statecode + "";
    
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }
  startenddatefilter(username: any, startdate: any, enddate: any, statuscode: any) {
    let url = "" + this.apiURL + "api/data/v9.0/incidents?$filter=kkk_fromemailid eq '" + username + "' and statecode eq " + statuscode + " and createdon ge '" + startdate + "T00:00:00Z' and createdon le '" + enddate + "T23:59:59Z'";
    console.log(url);
    return this.http.get(url);
  }

  commentdata(incidentid: any) {
    let url = "" + this.apiURL + "api/data/v9.0/annotations?$filter=_objectid_value eq " + incidentid + "&$select=subject,notetext,filename,documentbody, _ownerid_value";
    console.log(url);
    return this.http.get(url);
  }
  ticktetvalidation(ticktetnumber: any, parentcustomeridvalue: any) {
    let url = "" + this.apiURL + "api/data/v9.0/incidents?$filter=ticketnumber eq '" + ticktetnumber + "' and _customerid_value eq '" + parentcustomeridvalue + "'";
    console.log(url);
    return this.http.get(url);
  }

  // Dashboard API methods
  getDashboardCounts(email: any) {
    const url = "https://fb4fccab30bfec1087f97bf0e05e93.10.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ece00cda87244c589c7e28aaf6fd7574/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-gO1WeXSb0X2NuwSTmqsMEXjiCqcHMY6G_JsEJHBO0U";
    const body = {
      "Login Email id": email
    };
    console.log('Dashboard counts API URL:', url);
    console.log('Dashboard counts API body:', body);
    return this.http.post(url, body);
  }

  getRecentActivity(email: any) {
    const url = "https://fb4fccab30bfec1087f97bf0e05e93.10.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/698ebb2677264a5e97ff610e284f16f5/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3n-alJnVgEPuAHTL-nYqI1X342-UyGbjjiEQL1FgBoQ";
    const body = {
      "Login Email id": email
    };
    console.log('Recent activity API URL:', url);
    console.log('Recent activity API body:', body);
    return this.http.post(url, body);
  }



}
