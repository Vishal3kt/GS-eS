import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoadingModulesComponent } from './loading-modules/loading-modules.component';
import { RoutingguardGuard } from './routingprotector/routingguard.guard';
import { ForgotComponent } from './forgot/forgot.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyticketsComponent } from './mytickets/mytickets.component';
import { EntitlementComponent } from './entitlement/entitlement.component';
import { ReportsComponent } from './reports/reports.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { MytickteseditComponent } from './myticktesedit/myticktesedit.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'LoadingComponent', 
    component: LoadingModulesComponent,
    canActivate: [RoutingguardGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
          { path: 'Dashboard', component: DashboardComponent },
          { path: 'Myticket', component: MyticketsComponent },
          { path: 'MyEntitlement', component: EntitlementComponent },
          { path: 'Reports', component: ReportsComponent },
          { path: 'ChangePassword', component: ChangepasswordComponent },
          { path: 'EditDetails', component: MytickteseditComponent }
        ]
      }
    ]
  },
  { path: 'forgot', component: ForgotComponent }
];
