import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../pipes/filter.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-myticktesedit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FilterPipe, NgxSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  templateUrl: './myticktesedit.component.html',
  styleUrls: ['./myticktesedit.component.scss']
})
export class MytickteseditComponent implements OnInit {
  loading: boolean = false;
  commentsdata: any = [];
  caseForm: any = FormGroup;
  commentform: any = FormGroup;
  submitted: boolean = false;
  Dataentitlelist: any;
  entitlementid: any;
  userDetails: any;
  userDetails1: any;
  username: any;
  data: any;
  detailProduct: any;
  datafinal: any;
  lessonForm: any = FormGroup;
  commentboxshow: boolean = false;
  filename: any;
  base64: any;
  base64result1: any;
  filenames: any = [];
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  displayname: any;
  secondletter: string = '';
  firstletter: string = '';
  displayshortname: any;
  searchdata: string = '';
  constructor(public formBuilder: FormBuilder,
    public LoaderService: LoaderService,
    public api: ApiService, public route: ActivatedRoute, public router: Router, private notificationService: NotificationService,) {




    this.route.queryParams.subscribe((res: any) => {
      this.datafinal = JSON.parse(res.Data);
      const ticket = Array.isArray(this.datafinal) ? this.datafinal[0] : this.datafinal;
      this.caseForm = this.formBuilder.group({
        casetitle: [ticket?.title || '', [Validators.required]],
        casetype: [ticket?.casetypecode ?? '', [Validators.required]],
        priority: [ticket?.prioritycode ?? '', [Validators.required]],
        entitlement: [ticket?.new_entitlementname || ticket?.entitlement || '', [Validators.required]],
        discription: [ticket?.description || '']
      });

      // Disable all case information form controls to make them truly non-editable
      this.caseForm.controls['casetitle'].disable();
      this.caseForm.controls['casetype'].disable();
      this.caseForm.controls['priority'].disable();
      this.caseForm.controls['entitlement'].disable();
      this.caseForm.controls['discription'].disable();

    });
    this.commentform = this.formBuilder.group({
      comment: ['', [Validators.required]],
      title: ['']
    });

  }


  goBack() {
    this.router.navigate(['/LoadingComponent/Myticket']);
  }

  ngOnInit(): void {
    this.LoaderService.present();
    this.userDetails = sessionStorage.getItem("loginDetails");
    if (this.userDetails == undefined || this.userDetails == '' || this.userDetails == null) {
      this.userDetails = localStorage.getItem("loginDetails");
      this.userDetails1 = JSON.parse(this.userDetails);
      this.username = this.userDetails1.email;
      this.displayname = this.userDetails1.Data[0].fullname;
      let string = this.displayname;
      let string1 = string.split(" ");
      this.firstletter = string1[0].charAt(0);
      if (string1.length >= 2) {
        this.secondletter = string1[1].charAt(0);
      }
      this.displayshortname = this.firstletter + this.secondletter;
    } else {
      this.userDetails1 = JSON.parse(this.userDetails);
      this.username = this.userDetails1.email;
      this.displayname = this.userDetails1.Data[0].fullname;
      let string = this.displayname;
      let string1 = string.split(" ");
      this.firstletter = string1[0].charAt(0);
      if (string1.length >= 2) {
        this.secondletter = string1[1].charAt(0);
      }
      this.displayshortname = this.firstletter + this.secondletter;
    }
    this.api.getentitlementname(this.userDetails1.Data[0]._parentcustomerid_value)
      .subscribe((res: any) => {
        if (res?.value?.length > 0) {
          this.Dataentitlelist = res.value;
          this.entitlementid = res.value[0].entitlementid;
        } else {
          this.Dataentitlelist = [];
          this.entitlementid = null;
        }
      });

    this.route.queryParams.subscribe((res: any) => {
      this.datafinal = JSON.parse(res.Data);
      // Handle both array and object cases for datafinal
      const incidentId = Array.isArray(this.datafinal) ? this.datafinal[0].incidentid : this.datafinal.incidentid;
      this.api.commentdata(incidentId).subscribe((commentres: any) => {
        this.commentsdata = commentres.value;
      });
    })

  }
  get tempData() {
    return this.commentform.controls;
  }
  async onSubmit() {
    this.submitted = true;
    if (this.commentform.invalid) {
      // this.LoaderService.failNotification('Please Enter Comment');
      return;
    }
    else {
      this.loading = true;
      if (this.filenames.length != 0) {
        const incidentId = Array.isArray(this.datafinal) ? this.datafinal[0].incidentid : this.datafinal.incidentid;
        let data;
        for (let i = 0; i < this.filenames.length; i++) {
          if (i == 0) {
            data = {
              "filename": this.filenames[i].name,
              "objecttypecode": "incident",
              "isdocument": true,
              "documentbody": this.filenames[i].base64,
              "subject": this.commentform.value.title,
              "notetext": this.commentform.value.comment,
              "objectid_incident@odata.bind": "/incidents(" + incidentId + ")"
            }
          } else {
            data = {
              "filename": this.filenames[i].name,
              "objecttypecode": "incident",
              "isdocument": true,
              "documentbody": this.filenames[i].base64,
              "subject": "",
              "notetext": "",
              "objectid_incident@odata.bind": "/incidents(" + incidentId + ")"

            }
          }

          await this.api.documentupload(this.userDetails1.token, data)
            .subscribe((res: any) => {
              this.loading = false;
              this.commentboxshow = false;

              this.notificationService.showSuccess("Comment added successfully");

              this.ngOnInit();
            });

        }
      } else {
        // Comment without attachment - create simple annotation
        const incidentId = Array.isArray(this.datafinal) ? this.datafinal[0].incidentid : this.datafinal.incidentid;
        let data = {
          "objecttypecode": "incident",
          "isdocument": false,
          "subject": this.commentform.value.title,
          "notetext": this.commentform.value.comment,
          "objectid_incident@odata.bind": "/incidents(" + incidentId + ")"
        }
        this.api.documentupload(this.userDetails1.token, data)
          .subscribe((res: any) => {
            this.loading = false;
            this.commentboxshow = false;
            this.ngOnInit();
          });
      }
    }
  }
  addnotes() {
    this.commentboxshow = true;

  }
  close() {
    this.commentform.reset();
    this.commentboxshow = false;
  }
  pdfOnload(event: any) {

    const file = event.target.files[0];
    if (!file) {
      return;
    }
    this.filename = file.name;
    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64 = reader.result;
      var base64result = reader.result.split(';base64,')[0];
      this.base64result1 = reader.result.split(';base64,')[1];
      this.filenames.push({ name: file.name, base64: this.base64result1 });
      // Reset input so selecting the same file again triggers (change)
      if (event?.target) {
        event.target.value = '';
      }
    };

  }
  removedata(data: any, i: any) {
    this.filenames.splice(i, 1);
    // Reset input so selecting the same file again triggers (change)
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
  openfile(data: any) {
    const fileName = data.filename;
    let newfilename = fileName.split(".");
    let fileaddbefore;
    if (newfilename[1] == "docx") {
      fileaddbefore = "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,"
    }
    else if (newfilename[1] == "doc") {
      fileaddbefore = "data:application/msword;base64,";
    }
    else if (newfilename[1] == "xlsx") {
      fileaddbefore = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
    }
    else if (newfilename[1] == "pdf") {
      fileaddbefore = "data:application/pdf;base64,"
    }
    else if (newfilename[1] == "png") {
      fileaddbefore = "data:image/png;base64,";
    }
    else if (newfilename[1] == "jpg") {
      fileaddbefore = "data:image/jpg;base64,";
    }
    else if (newfilename[1] == "jpeg") {
      fileaddbefore = "data:image/jpeg;base64,"
    }
    const linkSource = fileaddbefore + data.documentbody;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    this.LoaderService.close();
  }
}
