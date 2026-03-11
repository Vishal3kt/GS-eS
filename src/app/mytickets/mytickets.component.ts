import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MytickteseditComponent } from '../myticktesedit/myticktesedit.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';

declare var window: any;

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

/** @title Date range picker comparison ranges */

@Component({
  selector: 'app-mytickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatChipsModule, MatSelectModule, NgxSpinnerModule, MytickteseditComponent],
  templateUrl: './mytickets.component.html',
  styleUrls: ['./mytickets.component.scss']
})
export class MyticketsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  formModal: any;
  activeLinkIndex = -1;
  caseForm: any = FormGroup;
  submitted = false;
  base64: string | ArrayBuffer | null | undefined;

  selectedstatus: string = '0';
  dashboardStatusFilter: string | null = null;
  Status: number = 0;
  userDetails: any;
  userDetails1: any;
  username: any;
  Data: any[] = [];
  Dataid: any[] = [];
  Data1: any[] = [];
  data2: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['ticketnumber', 'title', 'casetype', 'priority', 'entitlement', 'status', 'createdon', 'actions'];
  Dataentitlelist: any;
  documentuploadid: any;
  filename: any;
  base64result1: any;
  documentattach: any;
  loading: boolean = false;
  loading1: boolean = false;
  loading2: boolean = false;
  display: string = 'block';
  selectedrow: any;
  enablebtn: boolean = false;
  fileName: any;
  Fromdate: any;
  enddate: any;
  campaignOne: FormGroup;
  maxDate: Date;
  closebtn: boolean = false;
  selecteddataofbudget: string = '';
  selecteddataofcustomerreply: string = '';
  data3: any[] = [];
  DataCSV: any;
  entitlementid: any;
  seletedrecord: any[] = [];
  new_approvedhours: any;
  new_estimatedhours: any;
  ticketnumber: any;
  Description: any;
  formModal1: any;
  filenames: any[] = [];
  constructor(public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public LoaderService: LoaderService,
    public http: HttpClient,
    public api: ApiService,
    private cdr: ChangeDetectorRef) {
    this.maxDate = new Date();
    this.campaignOne = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    });
    this.campaignOne.get('end')?.valueChanges.subscribe(() => this.onChangeEvent(null));
  }

  trackByEntitlementId(index: number, item: any): string {
    return item.entitlementid;
  }

  // Helper function to get entitlement name by ID
  getEntitlementNameById(entitlementId: string): string {
    if (!entitlementId || !this.Dataentitlelist) {
      // Return first entitlement name (xebia) instead of N/A
      return this.Dataentitlelist && this.Dataentitlelist.length > 0
        ? this.Dataentitlelist[0].name
        : 'N/A';
    }

    const entitlement = this.Dataentitlelist.find((ent: any) =>
      ent.entitlementid === entitlementId
    );

    return entitlement ? entitlement.name : (this.Dataentitlelist[0]?.name || 'N/A');
  }

  // Helper function to get entitlement name from ticket data
  getEntitlementName(ticket: any): string {
    // First try to use new_entitlementname if available
    if (ticket.new_entitlementname) {
      return ticket.new_entitlementname;
    }

    // Then try to map using entitlement ID
    if (ticket._entitlementid_value) {
      return this.getEntitlementNameById(ticket._entitlementid_value);
    }

    // Fallback to first entitlement name (xebia)
    if (this.Dataentitlelist && this.Dataentitlelist.length > 0) {
      return this.Dataentitlelist[0].name;
    }

    return 'N/A';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.enablebtn = false;
    console.log(1 + 2 + 3);

    // Dashboard status filter (e.g. ?status=open)
    this.route.queryParams.subscribe((params: any) => {
      const status = (params?.status || '').toString().trim().toLowerCase();
      this.dashboardStatusFilter = status || null;

      // Map dashboard status into the existing statecode filter
      // api.mytickets(email, code) uses: statecode eq code
      if (status === 'resolved') {
        this.selectedstatus = '1';
      } else if (status === 'cancel') {
        this.selectedstatus = '2';
      } else {
        // open/hold/default should show active tickets
        this.selectedstatus = '0';
      }

      // Refresh list when status filter changes
      this.fetchTickets();
    });
  }

  private shouldIncludeByDashboardFilter(ticket: any): boolean {
    if (!this.dashboardStatusFilter || this.dashboardStatusFilter === 'resolved' || this.dashboardStatusFilter === 'cancel') {
      return true;
    }

    const statuscode = Number(ticket?.statuscode);

    if (this.dashboardStatusFilter === 'open') {
      // In this environment, "Open" means all active tickets (statecode=0),
      // regardless of the granular status reason (statuscode).
      return true;
    }

    if (this.dashboardStatusFilter === 'hold') {
      return statuscode === 2;
    }

    return true;
  }

  private fetchTickets(): void {
    if (this.selectedstatus == '0') {
      this.display = "table-cell";
    } else if (this.selectedstatus == '1') {
      this.display = "none";
    } else {
      this.display = "none";
    }
    this.caseForm = this.formBuilder.group({
      casetitle: ["", [Validators.required]],
      casetype: [""],
      priority: ["", [Validators.required]],
      entitlement: ["", [Validators.required]],
      discription: ["", [Validators.required]],
      // attachment: [""],
      oldticketno: [""]
    });

    this.LoaderService.present();
    this.userDetails = sessionStorage.getItem("loginDetails");
    console.log(this.userDetails);
    if (this.userDetails == undefined || this.userDetails == '' || this.userDetails == null) {
      this.userDetails = localStorage.getItem("loginDetails");
      this.userDetails1 = JSON.parse(this.userDetails);
      console.log(this.userDetails1);
      this.username = this.userDetails1.email;
    } else {
      this.userDetails1 = JSON.parse(this.userDetails);
      this.username = this.userDetails1.email;
    }
    // Only call getentitlementname if _parentcustomerid_value exists
    if (this.userDetails1.Data[0]._parentcustomerid_value) {
      this.api.getentitlementname(this.userDetails1.Data[0]._parentcustomerid_value).subscribe((res: any) => {
        console.log(res, "entitlement response");
        if (res?.value && res.value.length > 0) {
          this.Dataentitlelist = res.value;
          this.entitlementid = res.value[0].entitlementid;
          console.log('Dataentitlelist populated:', this.Dataentitlelist);
        } else {
          this.Dataentitlelist = [];
          this.entitlementid = null;
          console.log('No entitlement data available for this customer');
        }

        // Re-map entitlement names for already-loaded tickets
        if (this.dataSource?.data && this.dataSource.data.length > 0) {
          this.dataSource.data = this.dataSource.data.map((t: any) => ({
            ...t,
            new_entitlementname: this.getEntitlementName(t)
          }));
        }
        // Force change detection
        this.cdr.detectChanges();
        setTimeout(() => {
          console.log('Dataentitlelist after timeout:', this.Dataentitlelist);
        }, 100);
      });
    } else {
      this.Dataentitlelist = [];
      this.entitlementid = null;
      console.log('No parent customer associated - skipping entitlement lookup');
    }

    this.api.mytickets(this.userDetails1.email, this.selectedstatus).subscribe((res: any) => {
      console.log(res);
      this.Data = [];
      if (res != undefined || res != null || res != '') {
        if (res.value.length == 0) {
          this.Data = [];
          this.dataSource.data = [];
          this.LoaderService.close();
          this.LoaderService.failNotification('No data available.');
        } else {
          this.data2 = [];
          this.data3 = [];
          console.log(res.value);
          for (let i = 0; i < res.value.length; i++) {
            if (!this.shouldIncludeByDashboardFilter(res.value[i])) {
              // Skip tickets not matching dashboard selection (open/hold)
              continue;
            }
            let data1 = { ...res.value[i], selecteddataofbudget: '', selecteddataofcustomerreply: '' };
            let casetype = '';
            if (res.value[i].casetypecode == 1) {
              casetype = "Question";
            } else if (res.value[i].casetypecode == 2) {
              casetype = "Problem";
            } else if (res.value[i].casetypecode == 3) {
              casetype = "Feature Request";
            } else {
              casetype = "General"; // Default when casetypecode is null or not recognized
            }
            let prioritycode = '';
            if (res.value[i].prioritycode == 1) {
              prioritycode = "High";
            } else if (res.value[i].prioritycode == 2) {
              prioritycode = "Medium";
            } else if (res.value[i].prioritycode == 3) {
              prioritycode = "Low";
            }
            else if (res.value[i].prioritycode == 4) {
              prioritycode = "Urgent";
            }
            let statecode = '';
            if (res.value[i].statecode == 0) {
              statecode = "Active";
            }
            else if (res.value[i].statecode == 1) {
              statecode = "Resolved";
            }
            else if (res.value[i].statecode == 2) {
              statecode = "Cancelled";
            }
            let statuscode = '';
            if (res.value[i].statuscode == 4) {
              statuscode = "Analysis"
            } else if (res.value[i].statuscode == 100000004) {
              statuscode = "Open"
            } else if (res.value[i].statuscode == 968590004) {
              statuscode = "Customer Info"
            }
            else if (res.value[i].statuscode == 968590005) {
              statuscode = "Customer Reply"
            }
            else if (res.value[i].statuscode == 968590006) {
              statuscode = "Budget Approval"
            }
            else if (res.value[i].statuscode == 968590007) {
              statuscode = "Budget Approved"
            }
            else if (res.value[i].statuscode == 100000005) {
              statuscode = "Assigned"
            }
            else if (res.value[i].statuscode == 1) {
              statuscode = "In Progress"
            }
            else if (res.value[i].statuscode == 968590008) {
              statuscode = "Customer Testing"
            }
            else if (res.value[i].statuscode == 968590009) {
              statuscode = "Deploy"
            }
            else if (res.value[i].statuscode == 2) {
              statuscode = "On Hold by 3KT"
            }
            else if (res.value[i].statuscode == 968590010) {
              statuscode = "On Hold by Customer"
            }
            else if (res.value[i].statuscode == 100000001) {
              statuscode = "UAT"
            }
            else if (res.value[i].statuscode == 100000002) {
              statuscode = "Production"
            }
            else if (res.value[i].statuscode == 968590000) {
              statuscode = "Resolution Approval"
            } else if (res.value[i].statuscode == 100000003) {
              statuscode = "Completed"
            } else if (res.value[i].statuscode === 3) {
              statuscode = "Cust Info Required"
            }
            else if (res.value[i].statuscode == 968590011) {
              statuscode = "Request for cancelation"
            }
            else if (res.value[i].statuscode == 5) {
              statuscode = "Problem Solved"
            }
            else if (res.value[i].statuscode == 1000) {
              statuscode = "Information Provided"
            }
            else if (res.value[i].statuscode == 6) {
              statuscode = "Cancelled"
            }
            else if (res.value[i].statuscode == 2000) {
              statuscode = "Merged"
            }
            else if (res.value[i].statuscode == 100000000) {
              statuscode = "On Hold"
            }
            let new_estimatedhours;
            if (res.value[i].new_estimatedhours == null) {
              new_estimatedhours = 0;
            } else {
              new_estimatedhours = res.value[i].new_estimatedhours;
            }
            let new_approvedhours;
            if (res.value[i].new_approvedhours == null) {
              new_approvedhours = 0;
            } else {
              new_approvedhours = res.value[i].new_approvedhours;
            }
            let createdon = new Date(res.value[i].createdon);
            let createdon1 = createdon.getFullYear() + '-' + (createdon.getMonth() + 1).toString().padStart(2, "0") + '-' + createdon.getDate().toString().padStart(2, "0");

            // Update data1 with processed values
            data1.casetype = casetype;
            data1.priority = prioritycode;
            data1.status = statuscode;
            data1.state = statecode;
            data1.createdon = createdon1;

            // Map entitlement name using the helper function
            data1.new_entitlementname = this.getEntitlementName(res.value[i]);

            let data2 = {
              "Ticket Number": res.value[i].ticketnumber,
              "Case Title": res.value[i].title,
              "Case Type": casetype,
              "Priority": prioritycode,
              "Entitlement": data1.new_entitlementname,
              "Estimated Hours": new_estimatedhours,
              "Approved Hours": new_approvedhours,
              "Status Reason": statuscode,
              "Created On": createdon1,
              "State": statecode
            };
            console.log(data2);
            this.data2.push(data1);
            this.data3.push(data2);
          }

          this.Data = this.data2;
          this.DataCSV = this.data3;
          this.dataSource.data = this.Data;

          // Ensure paginator is connected after data is loaded
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });

          this.LoaderService.close();
          // Enable the create button after data is loaded
          this.enablebtn = true;

          if (this.data2.length === 0) {
            this.LoaderService.failNotification('No data available.');
          }
        }
      } else {
        this.Data = [];
        this.dataSource.data = [];
        this.LoaderService.close();
        this.LoaderService.failNotification('Your session has expired. Please login to continue.');
      }
    });


  }

  get tempData() {
    return this.caseForm.controls;
  }
  openModel() {
    this.caseForm.reset();
    this.caseForm.patchValue({ entitlement: this.entitlementid });
    this.formModal = new window.bootstrap.Modal(

      document.getElementById('myModal')

    );
    // this.caseForm.reset();
    this.submitted = false;
    this.formModal.show({
      backdrop: 'true',
    });
  }


  onSubmit() {
    this.submitted = true;
    if (this.caseForm.invalid) {
      return;
    }
    else {
      this.loading = true;
      console.log(this.caseForm.value);
      if (this.caseForm.value.oldticketno == null || this.caseForm.value.oldticketno == '') {
        this.afterticketvalidation();
      } else {
        this.api.ticktetvalidation(this.caseForm.value.oldticketno, this.userDetails1.Data[0]._parentcustomerid_value).subscribe((res: any) => {
          console.log(res);
          if (res.value.length == 0) {
            this.loading = false;
            this.LoaderService.failNotification('Your entered ticket number is invalid. Please check once.')
          } else {
            this.afterticketvalidation();
          }
        })
      }


    }
  }

  afterticketvalidation() {
    console.log(this.caseForm.value);
    let entitle = '/entitlements(' + this.caseForm.value.entitlement + ')';
    let customerid = '/accounts(' + this.userDetails1.Data[0].contactid + ')';
    let contact = '/contacts(' + this.userDetails1.Data[0]._parentcustomerid_value + ')';
    let data = {
      "title": this.caseForm.value.casetitle,
      "casetypecode": this.caseForm.value.casetype,
      "prioritycode": this.caseForm.value.priority,
      "description": this.caseForm.value.discription,
      "caseorigincode": 3,
      "primarycontactid@odata.bind": customerid,
      "customerid_account@odata.bind": contact,
      "entitlementid@odata.bind": entitle,
      "new_oldticketreferenceno": this.caseForm.value.oldticketno
    }
    console.log(data);
    this.api.casecreation(this.userDetails1.token, data).subscribe((response: any) => {
      if (response) {
        console.clear();
        console.log(response, "response");
        console.log(response.headers.get('odata-entityid'));
        this.documentuploadid = response.headers.get('odata-entityid');
        if (this.documentuploadid != null) {
          let data = this.documentuploadid.split('incidents(')[1];
          let objectid_incident = data.replace(')', '');

          if (this.filenames.length > 0) {
            // Only upload if files are selected
            for (let i = 0; i < this.filenames.length; i++) {
              let formdata = {
                "filename": this.filenames[i].name,
                "objecttypecode": "incident",
                "isdocument": true,
                "documentbody": this.filenames[i].base64,
                "objectid_incident@odata.bind": '/incidents(' + objectid_incident + ')'
              };
              this.api.documentupload(this.userDetails1.token, formdata).subscribe((resattach: any) => {
                console.log(resattach);
                this.documentattach = resattach.headers.get('odata-entityid');
                if (this.documentattach != null) {
                  if ((i + 1) == this.filenames.length) {
                    this.loading = false;
                    this.close();
                    this.ngOnInit();
                  }

                } else {
                  this.loading = false;
                  this.LoaderService.failNotification("Error while uploading an file to the server. Please try again.");
                }

              });

            }
          } else {
            // No files selected, just close and refresh
            this.loading = false;
            this.close();
            this.ngOnInit();
          }


        } else {
          this.loading = false;
          this.LoaderService.failNotification("Error while creating case. Please try again.");
        }
      } else {
        this.loading = false;
        this.LoaderService.failNotification("Error while creating case. Please try again.");

      }
    });
  }


  close1() {

    this.formModal1.hide({
      backdrop: 'false',
    });
  }
  close() {

    this.submitted = false;
    this.formModal.hide({
      backdrop: 'false',
    });
  }

  pdfOnload(event: any) {

    const file = event.target.files[0];
    console.log(file);
    if (!file) {
      return;
    }
    this.filename = file.name;
    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.base64 = reader.result;
      var base64result = reader.result.split(';base64,')[0];
      this.base64result1 = reader.result.split(';base64,')[1];
      this.filenames.push({ name: file.name, base64: this.base64result1 });
      console.log(this.filenames);
      // Reset input so selecting the same file again triggers (change)
      if (event?.target) {
        event.target.value = '';
      }
      //  console.log(base64result,"bhavanibase64");         
      //  console.log(this.base64result1);
    };
  }

  statuscode(ev: any) {
    console.log(ev);
    this.selectedstatus = ev;
    this.campaignOne.reset();
    this.closebtn = false;
    this.ngOnInit();
  }

  selectrow(data: any) {
    //   if(this.selectedstatus=="0"){
    //   this.enablebtn=true; 
    //   this.Data.map((e:any) => {  
    //     if(e.ticketnumber==data.ticketnumber){  
    //       console.log(e.ticketnumber);  
    //       if(e.selected==true){  
    //         e.selected = false;    
    //         this.selectedrow='';
    //         this.enablebtn=false;   
    //         console.log( this.selectedrow," this.selectedrow");        
    //       }  
    //       else{  
    //         console.log("bhava"); 
    //         this.enablebtn=true; 
    //         e.selected = true; 
    //         this.selectedrow=e; 
    //         console.log( this.selectedrow," this.selectedrow1");

    //        }  
    //     }  
    //     else{  
    //       e.selected = false;  
    //       console.log( this.selectedrow," this.selectedrow");
    //     }

    //   })
    // }

  }
  onhold() {
    this.loading1 = true;
    console.log(this.seletedrecord[0]);
    let statuscode = "2";
    let statecode = "0";
    this.api.onholdorcancel(this.seletedrecord[0].incidentid, statuscode, statecode).subscribe((res: any) => {
      console.log(res);
      this.loading1 = false;
      this.Data.map((e: any) => {
        e.selected = false;
      });
      this.LoaderService.successNotification("success");
      this.enablebtn = false;
      this.close1();
      this.ngOnInit();


    });
  }
  oncancel() {
    this.loading2 = true;
    let statuscode = "968590011";
    let statecode = "0";
    console.log(this.seletedrecord[0]);
    this.api.onholdorcancel(this.seletedrecord[0].incidentid, statuscode, statecode).subscribe((res: any) => {
      console.log(res);
      this.loading2 = false;
      this.Data.map((e: any) => {
        e.selected = false;
      });
      this.LoaderService.successNotification("success");
      this.enablebtn = false;
      this.close1();
      this.ngOnInit();

    });

  }

  download() {

    if (this.Data.length != 0) {
      let state;
      if (this.selectedstatus == "0") {
        state = "Active";
      } else if (this.selectedstatus == "1") {
        state = "Resolved";
      } else {
        state = "Cancelled";
      }
      this.filename = 'Tickets Status Reason is ' + state;
      this.downloadFile(this.DataCSV, this.filename);
    } else {
      this.LoaderService.failNotification("No data available in table.");
    }
  }


  downloadFile(data: any, filename = 'data') {

    let date = filename;
    let csvData = this.ConvertToCSV(data, ['Ticket Number', 'Case Title', 'Case Type', 'Priority', 'Entitlement', 'Estimated Hours', 'Approved Hours', 'Status Reason', 'Created On', 'State']);
    console.log(csvData);
    let blob;
    if (date == '') {
      blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });

    } else {
      blob = new Blob(['\ufeff' + date + '\r\n' + csvData], { type: 'text/csv;charset=utf-8;' });

    }
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    console.log(url);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: any, headerList: any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    console.log(str);
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        console.log(head);
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    console.log(str);
    return str;

  }
  onChangeEvent(ev: any) {
    console.log(ev);
    console.log(this.campaignOne.value.start);
    console.log(this.campaignOne.value.end);
    if (this.campaignOne.value.end != null) {
      this.closebtn = true;
      let date = new Date(this.campaignOne.value.start);
      let date1 = new Date(this.campaignOne.value.end);
      let startdate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, "0") + '-' + date.getDate().toString().padStart(2, "0");
      console.log(startdate);
      this.Fromdate = startdate;
      let enddate = date1.getFullYear() + '-' + (date1.getMonth() + 1).toString().padStart(2, "0") + '-' + date1.getDate().toString().padStart(2, "0");
      console.log(enddate);
      this.enddate = enddate;
      this.enablebtn = false;
      this.LoaderService.present();
      this.Data = [];
      this.data2 = [];
      this.api.startenddatefilter(this.userDetails1.email, startdate, enddate, this.selectedstatus).subscribe((res: any) => {
        console.log(res);
        if (res.value.length == 0) {
          this.Data = [];
          this.data2 = [];
          this.dataSource.data = [];
          this.LoaderService.close();
          this.LoaderService.failNotification('No data available.');
        } else {
          for (let i = 0; i < res.value.length; i++) {
            let data1 = { ...res.value[i], selecteddataofbudget: '', selecteddataofcustomerreply: '' };

            let casetype = '';
            if (res.value[i].casetypecode == 1) {
              casetype = "Question";
            } else if (res.value[i].casetypecode == 2) {
              casetype = "Problem";
            } else if (res.value[i].casetypecode == 3) {
              casetype = "Feature Request";
            }
            let prioritycode = '';
            if (res.value[i].prioritycode == 1) {
              prioritycode = "High";
            } else if (res.value[i].prioritycode == 2) {
              prioritycode = "Medium";
            } else if (res.value[i].prioritycode == 3) {
              prioritycode = "Low";
            }
            else if (res.value[i].prioritycode == 4) {
              prioritycode = "Urgent";
            }
            let statecode = '';
            if (res.value[i].statecode == 0) {
              statecode = "Active";
            }
            else if (res.value[i].statecode == 1) {
              statecode = "Resolved";
            }
            else if (res.value[i].statecode == 2) {
              statecode = "Cancelled";
            }
            let statuscode = '';
            if (res.value[i].statuscode == 4) {
              statuscode = "Analysis"
            } else if (res.value[i].statuscode == 100000004) {
              statuscode = "Open"
            } else if (res.value[i].statuscode == 968590004) {
              statuscode = "Customer Info"
            }
            else if (res.value[i].statuscode == 968590005) {
              statuscode = "Customer Reply"
            }
            else if (res.value[i].statuscode == 968590006) {
              statuscode = "Budget Approval"
            }
            else if (res.value[i].statuscode == 968590007) {
              statuscode = "Budget Approved"
            }
            else if (res.value[i].statuscode == 100000005) {
              statuscode = "Assigned"
            }
            else if (res.value[i].statuscode == 1) {
              statuscode = "In Progress"
            }
            else if (res.value[i].statuscode == 968590008) {
              statuscode = "Customer Testing"
            }
            else if (res.value[i].statuscode == 968590009) {
              statuscode = "Deploy"
            }
            else if (res.value[i].statuscode == 2) {
              statuscode = "On Hold by 3KT"
            }
            else if (res.value[i].statuscode == 2) {
              statuscode = "On Hold by Customer"
            }
            else if (res.value[i].statuscode == 100000001) {
              statuscode = "UAT"
            }
            else if (res.value[i].statuscode == 100000002) {
              statuscode = "Production"
            }
            else if (res.value[i].statuscode == 968590000) {
              statuscode = "Resolution Approval"
            } else if (res.value[i].statuscode == 100000003) {
              statuscode = "Completed"
            }
            else if (res.value[i].statuscode == 968590011) {
              statuscode = "Request for cancelation"
            }
            else if (res.value[i].statuscode == 5) {
              statuscode = "Problem Solved"
            }
            else if (res.value[i].statuscode == 1000) {
              statuscode = "Information Provided"
            }
            else if (res.value[i].statuscode == 6) {
              statuscode = "Cancelled"
            }
            else if (res.value[i].statuscode == 2000) {
              statuscode = "Merged"
            }
            else if (res.value[i].statuscode == 100000000) {
              statuscode = "On Hold"
            }
            let new_estimatedhours;
            if (res.value[i].new_estimatedhours == null) {
              new_estimatedhours = 0;
            } else {
              new_estimatedhours = res.value[i].new_estimatedhours;
            }
            let new_approvedhours;
            if (res.value[i].new_approvedhours == null) {
              new_approvedhours = 0;
            } else {
              new_approvedhours = res.value[i].new_approvedhours;
            }
            let createdon = new Date(res.value[i].createdon);
            let createdon1 = createdon.getFullYear() + '-' + (createdon.getMonth() + 1).toString().padStart(2, "0") + '-' + createdon.getDate().toString().padStart(2, "0");
            let data2 = {
              "Ticket Number": res.value[i].ticketnumber,
              "Case Title": res.value[i].title,
              "Case Type": casetype,
              "Priority": prioritycode,
              "Entitlement": res.value[i].new_entitlementname,
              "Estimated Hours": new_estimatedhours,
              "Approved Hours": new_approvedhours,
              "Status Reason": statuscode,
              "Created On": createdon1,
              "State": statecode
            }

            console.log(data1);
            this.data2.push(data1);
            this.data3.push(data2);


            if ((i + 1) == res.value.length) {
              this.Data = this.data2;
              this.DataCSV = this.data3;
              this.dataSource.data = this.Data;

              // Ensure paginator is connected after data is loaded
              setTimeout(() => {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              });

              this.LoaderService.close();
            }
          }
        }
      });
    }
  }

  removedates() {
    this.closebtn = false;
    this.campaignOne.reset();
    this.ngOnInit();
  }
  updatechange(ev: any, data: any, i: any) {
    console.log(ev);
    this.selecteddataofbudget = ev;
    this.updatechange1(ev, data, i);
  }
  updatechange1(ev: any, data: any, i: any) {
    console.log(ev, data);
    if (this.selecteddataofbudget != '') {
      console.log(ev);
      let statuscode = ev;
      let statecode = "0";
      console.log(data);
      this.api.onholdorcancel(data.incidentid, statuscode, statecode).subscribe((res: any) => {
        console.log(res);
        this.ngOnInit();
      });
    }
  }


  removecustomerreply(data: any) {
    this.selecteddataofcustomerreply = '';
    data.selecteddataofcustomerreply = '';
  }
  removebudget(data: any) {
    this.selecteddataofbudget = '';
    data.selecteddataofbudget = '';
  }
  more(data: any) {
    this.seletedrecord = [data];
    console.log(data);
    this.ticketnumber = data.ticketnumber;
    this.new_approvedhours = data.new_approvedhours / 60;
    this.new_estimatedhours = data.new_estimatedhours / 60;
    this.Description = data.description;
    console.log(this.seletedrecord);
    // alert(data.new_approvedhours);
    // alert(this.new_approvedhours);
    // setTimeout(()=>{
    this.formModal1 = new window.bootstrap.Modal(
      document.getElementById('myModal1')
    );
    this.formModal1.show({
      backdrop: 'true',
    });
    // },1000)


  }
  edit(data: any) {
    this.close1();
    let objToSend: NavigationExtras = {
      queryParams: {
        Data: JSON.stringify(data)
      },

    };
    this.router.navigate(['/LoadingComponent/EditDetails'], objToSend);
  }
  removedata(data: any, i: any) {
    this.filenames.splice(i, 1);
    console.log(this.filenames);
    // Reset input so selecting the same file again triggers (change)
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
