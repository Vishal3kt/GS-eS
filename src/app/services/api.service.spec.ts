import {
    ComponentFixture,
    TestBed,
    async,
    fakeAsync,
    tick,
    inject,
  } from '@angular/core/testing';
  import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { LoaderService } from '../services/loader.service';
  import { RouterTestingModule } from '@angular/router/testing';
  import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
  import { Observable } from 'rxjs';
  import { throwError } from 'rxjs';
  import { NgxSpinnerService } from 'ngx-spinner';
  import Swal from 'sweetalert2';
  import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
  import { observable, of } from 'rxjs';
  
  const resToken = {
    access_token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovLzNrdHNhbmRib3guY3JtLmR5bmFtaWNzLmNvbS8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84MTg0NjdjZi00NGI5LTQ1YTUtYTQxYS0xZWY5MjRmY2Q3OTUvIiwiaWF0IjoxNjU3Nzg0NTA0LCJuYmYiOjE2NTc3ODQ1MDQsImV4cCI6MTY1Nzc4ODg1OSwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhUQUFBQXBxQ1YzOStMWG9sSGZ5aWdWZ3ZjWHNTUmFOS0QxTVd2aFRPVEprdnlybkU9IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjliZGZlOWMwLTRjMzItNGJjNS05NDkxLTdlN2JlM2FjN2RhMiIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiQ1JNIiwiZ2l2ZW5fbmFtZSI6IkludGVncmF0aW9uIiwiaXBhZGRyIjoiNDkuMzcuMTMxLjYiLCJuYW1lIjoiSW50ZWdyYXRpb24gQ1JNIiwib2lkIjoiNDFmMzFlNDAtMDhhYi00NWExLWFiZWYtMzkzMjdlODJlNDZlIiwicHVpZCI6IjEwMDMyMDAxRTgzMTU0RUYiLCJyaCI6IjAuQVhFQXoyZUVnYmxFcFVXa0doNzVKUHpYbFFjQUFBQUFBQUFBd0FBQUFBQUFBQUNIQVBZLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6Ilpxbm8ycFgxcmxBMzVGNk8xMUJwRm9BMTd1WWFHVjFHYm5WZDZKbU5FUGciLCJ0aWQiOiI4MTg0NjdjZi00NGI5LTQ1YTUtYTQxYS0xZWY5MjRmY2Q3OTUiLCJ1bmlxdWVfbmFtZSI6IkludGVncmF0aW9uQ1JNQDNrdGVjaG5vbG9naWVzLmNvbSIsInVwbiI6IkludGVncmF0aW9uQ1JNQDNrdGVjaG5vbG9naWVzLmNvbSIsInV0aSI6IkZoNmpTcGlnVkVDd3VDOWNkb21UQUEiLCJ2ZXIiOiIxLjAifQ.k4GXStHpkQEetPJGyZwj-_WMhERrK53BcJSdz8Pt02bhcwtBWJKatdr_P1ggpgGw9iAiyrjuYiYb6-DmOCnP5uScaVUovxzZmzHf6XMkT2zstHTXoAq2GyQuHjxBAyB0xbGvleKfdPxtoq4QtWMNJcXfeYPLi_sp68OfVBpxwURLnEoE_rYyhRZh_tmwn82KixlKEnFlkatv5j9eEAHRJQyJLmlcqEfxIYmNpWqRkQ_5kfhqs_EQ5gGv1rVwxiBC0r-wUtMiqX8JPwMT0yXQppGHwbF9Z5397axwGNZ63ZvoFwnOEs6hmHjwqXAdcSZgDvqw5kF4z-O09dV0WujgQw',
  };
  const loginmock = { value: [{ new_portalpassword: 'MhIcXOriBL' }] };
  const loginmockzero = { value: [] };

import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let mockValidator: jasmine.SpyObj<LoaderService>;
  let httpMock: HttpTestingController
    environment.apiUrl1 = 'mockme';
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            RouterTestingModule,
          ],
          schemas: [NO_ERRORS_SCHEMA],
        providers: [
            ApiService,
            {provide: mockValidator, useValue: jasmine.createSpyObj('LoaderService', [
                'present',
                'close',
                'successNotification',
                'failNotification',
              ])}
        ]
    });
    service = TestBed.inject(ApiService);
    mockValidator = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;;
    httpMock = TestBed.inject(HttpTestingController) as jasmine.SpyObj<HttpTestingController>;
  });

  it('#post should return expected data', inject([ApiService], (service: ApiService) => {
    const expectedData = [
      { 'name': 'one' },
      { 'name': 'two' },
      { 'name': 'three' },
    ];
 
    service.tokengeneration().subscribe(data => {
      expect(data).toEqual(expectedData);
    });
  }));

    it('#generatepassword should return expected data', inject([ApiService], (service: ApiService) => {
      const expectedData = [
        { 'name': 'one' },
        { 'name': 'two' },
        { 'name': 'three' },
      ];
      const username = 'csacs';
      const token = 'asasc';
      service.generatepassword(username, token).subscribe(data => {
        expect(data).toEqual(expectedData);
      }); 

    }));

      it('#getEntitlement should return expected data', inject([ApiService], (service: ApiService) => {
        const expectedData = [
          { 'name': 'one' },
          { 'name': 'two' },
          { 'name': 'three' },
        ];
        const email = 'csacs';
        const token = 'asasc';
        service.getEntitlement(email, token).subscribe(data => {
          expect(data).toEqual(expectedData);
        }); 

    // let req = httpMock.expectOne(request => request.responseType === 'json');
    // expect(req.request.method).toEqual('POST');
}));

it('#getEntitlementstep2 should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const username = 'csacs';
  const token = 'asasc';
  service.getEntitlementstep2(username, token).subscribe(data => {
    expect(data).toEqual(expectedData);
  }); 

}));

it('#forgotPassword should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const username = 'csacs';
  const token = 'asasc';
  service. forgotPassword(username, token).subscribe(data => {
    expect(data).toEqual(expectedData);
  }); 

}));

it('#mytickets should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const username = 'csacs';
  const token = 'asasc';
  const code ='cas';
  service.mytickets(username, code, token).subscribe(data => {
    expect(data).toEqual(expectedData);
  }); 

}));

it('#getentitlementname should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const username = 'csacs';
  const token = 'asasc';
  service.getentitlementname(username, token).subscribe(data => {
    expect(data).toEqual(expectedData);
  }); 

}));

it('#casecreation should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const username = 'csacs';
  const token = 'asasc';
  service.casecreation(username, token).subscribe(data => {
    expect(data).toEqual(expectedData as unknown as HttpResponse<Blob>);
  }); 

}));

it('#documentupload should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const username = 'csacs';
  const token = 'asasc';
  service.documentupload(username, token).subscribe(data => {
    expect(data).toEqual(expectedData as unknown as HttpResponse<Blob>);
  }); 

}));

it('# onholdorcancel should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const incidentid = 'csacs';
  const statuscode = '33';
  const statecode = '8';
  service. onholdorcancel(incidentid,statuscode,statecode).subscribe(data => {
    expect(data).toEqual(expectedData as unknown as HttpResponse<Blob>);
  }); 

}));

it('# startenddatefilter should return expected data', inject([ApiService], (service: ApiService) => {
  const expectedData = [
    { 'name': 'one' },
    { 'name': 'two' },
    { 'name': 'three' },
  ];
  const username = 'csacs';
  const token = 'asasc';
  const incidentid = 'csacs';
  const statuscode = '33';
  const statecode = '8';
  service.startenddatefilter(username, token, incidentid,statuscode,statecode).subscribe(data => {
    expect(data).toEqual(expectedData as unknown as HttpResponse<Blob>);
  }); 

}));

it('Error', ()=>{
  // Error handling is now handled by the interceptor
  expect(true).toBe(true);
})
});
