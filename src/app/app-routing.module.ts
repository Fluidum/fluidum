import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DebugContractComponent } from './debug-contract/debug-contract/debug-contract.component';

import { HomeComponent } from './home/home/home.component';

const routes: Routes = [ { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
{ path: 'home', component:  HomeComponent},
{ path: 'dashboard', component:  DashboardComponent},
{ path: 'debug', component:  DebugContractComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
