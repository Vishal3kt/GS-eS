import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-entitlement',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, NgxSpinnerModule],
  templateUrl: './entitlement.component.html',
  styleUrls: ['./entitlement.component.scss']
})
export class EntitlementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userDetails: any;
  userDetails1: any;
  Data: any[] = [];
  username: any;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['name', 'startdate', 'enddate', 'totalterms', 'remainingterms'];

  constructor(public api: ApiService, public LoaderService: LoaderService) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.LoaderService.present();
    this.userDetails = sessionStorage.getItem('loginDetails');
    if (this.userDetails == null || this.userDetails === '' || this.userDetails == undefined) {
      this.userDetails = localStorage.getItem('loginDetails');
      this.userDetails1 = JSON.parse(this.userDetails);
      this.username = this.userDetails1.email;
    } else {
      this.userDetails1 = JSON.parse(this.userDetails);
      this.username = this.userDetails1.email;
    }

    this.api.getEntitlement(this.userDetails1.email).subscribe((res: any) => {
      if (res?.value?.length) {
        // Check if _parentcustomerid_value is not null before making the second API call
        if (res.value[0]._parentcustomerid_value) {
          this.api.getEntitlementstep2(res.value[0]._parentcustomerid_value).subscribe((res1: any) => {
            if (res1?.value?.length) {
              this.Data = res1.value;
              this.dataSource.data = this.Data;
              this.LoaderService.close();
            } else {
              this.dataSource.data = [];
              this.LoaderService.close();
              this.LoaderService.failNotification('No entitlement data available.');
            }
          });
        } else {
          // Handle case where customer is not associated with any parent account
          this.dataSource.data = [];
          this.LoaderService.close();
          this.LoaderService.failNotification('No parent account associated with this contact. Cannot retrieve entitlements.');
        }
      } else {
        this.dataSource.data = [];
        this.LoaderService.close();
        this.LoaderService.failNotification('Your session has expired. Please login to continue.');
      }
    });
  }
}
