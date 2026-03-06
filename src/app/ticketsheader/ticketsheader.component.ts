import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticketsheader',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticketsheader.component.html',
  styleUrls: ['./ticketsheader.component.scss']
})
export class TicketsheaderComponent implements OnInit {
  navLinks: { label: string; link: string; index: number; }[];

   
  constructor(public router: Router) { 
    this.navLinks = [
      {
          label: 'Draft',
          link: '/LoadingComponent/Myticket',
          index: 0
      }, {
          label: 'Opened',
          link: '/LoadingComponent/Myticket',
          index: 1
      }, {
          label: 'Cancelled',
          link: '/LoadingComponent/Myticket',
          index: 2
      } 
  ];
  }

  ngOnInit(): void {
    
    }
}
