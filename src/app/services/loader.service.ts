import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(public Loader:NgxSpinnerService) { }
  present(){
    this.Loader.show(); 
  }
  close(){
    this.Loader.hide(); 
  }

  successNotification(msg:any) {
    Swal.fire('Alert', msg, 'success');
  }
  failNotification(msg:any) {
    Swal.fire('Alert', msg, 'error');
  }

}
