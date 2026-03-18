import { Component, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loading-modules',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './loading-modules.component.html',
  styleUrls: ['./loading-modules.component.scss']
})
export class LoadingModulesComponent implements OnInit {
  navItem = [
    { name: 'Dashboard', img: "home1.png", img1: "home.png", selected: 'true', icon: 'dashboard', path: '/LoadingComponent/Dashboard' },
    { name: 'My Entitlement', img: "Entitlement.png", selected: 'true', img1: "Entitlement1.png", icon: 'description', path: '/LoadingComponent/MyEntitlement' },
    { name: 'My Ticket', img: "ticket.png", img1: "ticket1.png", selected: 'true', icon: 'support_agent', path: '/LoadingComponent/Myticket' },
    { name: 'Reports', img: "Report.png", img1: "Report1.png", selected: 'true', icon: 'assessment', path: '/LoadingComponent/Reports' },
    { name: 'Profile', img: "Report.png", img1: "Report1.png", selected: 'true', icon: 'person', path: '/LoadingComponent/Profile' }
  ];
  currentUrl: any;
  userDetails: any;
  userDetails1: any;
  username: any;
  isDropdownOpen: boolean = false;

  constructor(public router: Router) {

    this.router.events.subscribe((event: any) => {
      console.log('Router event:', event);
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        console.log('Current URL:', this.currentUrl);

        // Check for EditDetails first (more specific)
        if (this.currentUrl.includes("/LoadingComponent/EditDetails")) {
          console.log('Setting EditDetails active state - URL matched');
          console.log('Current navItem states before:', this.navItem.map(item => ({ name: item.name, selected: item.selected })));
          this.navItem[0].selected = "false";  // Dashboard
          this.navItem[1].selected = "false";  // My Entitlement
          this.navItem[2].selected = "true";   // My Ticket active
          this.navItem[3].selected = "false";  // Reports
          this.navItem[4].selected = "false";  // Profile
          console.log('Current navItem states after:', this.navItem.map(item => ({ name: item.name, selected: item.selected })));
        }
        else if (this.currentUrl.includes("/LoadingComponent/Dashboard")) {
          this.navItem[0].selected = "true";   // Dashboard active
          this.navItem[1].selected = "false";  // My Entitlement
          this.navItem[2].selected = "false";  // My Ticket
          this.navItem[3].selected = "false";  // Reports
          this.navItem[4].selected = "false";  // Profile
        } else if (this.currentUrl.includes("/LoadingComponent/MyEntitlement")) {
          this.navItem[0].selected = "false";  // Dashboard
          this.navItem[1].selected = "true";   // My Entitlement active
          this.navItem[2].selected = "false";  // My Ticket
          this.navItem[3].selected = "false";  // Reports
          this.navItem[4].selected = "false";  // Profile
        }
        else if (this.currentUrl.includes("/LoadingComponent/Myticket")) {
          this.navItem[0].selected = "false";  // Dashboard
          this.navItem[1].selected = "false";  // My Entitlement
          this.navItem[2].selected = "true";   // My Ticket active
          this.navItem[3].selected = "false";  // Reports
          this.navItem[4].selected = "false";  // Profile
        }
        else if (this.currentUrl.includes("/LoadingComponent/Reports")) {
          this.navItem[0].selected = "false";  // Dashboard
          this.navItem[1].selected = "false";  // My Entitlement
          this.navItem[2].selected = "false";  // My Ticket
          this.navItem[3].selected = "true";   // Reports active
          this.navItem[4].selected = "false";  // Profile
        }
        else if (this.currentUrl.includes("/LoadingComponent/Profile")) {
          this.navItem[0].selected = "false";  // Dashboard
          this.navItem[1].selected = "false";  // My Entitlement
          this.navItem[2].selected = "false";  // My Ticket
          this.navItem[3].selected = "false";  // Reports
          this.navItem[4].selected = "true";   // Profile active
        } else {
          this.navItem[0].selected = "false";
          this.navItem[1].selected = "false";
          this.navItem[2].selected = "false";
          this.navItem[3].selected = "false";
          this.navItem[4].selected = "false";
        }
      }
    })
  }

  ngOnInit(): void {
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
  }

  // Toggle dropdown
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userProfile = document.querySelector('.user-profile');

    if (userProfile && !userProfile.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  // View profile method
  viewProfile(): void {
    this.isDropdownOpen = true;
    this.router.navigate(["/LoadingComponent/Profile"]);
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(["/login"]);
  }
  changepassword() {
    this.isDropdownOpen = true;
    this.router.navigate(["/LoadingComponent/ChangePassword"]);
  }
}
