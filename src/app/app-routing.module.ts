import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CreateStreamComponent } from './create-stream/create-stream/create-stream.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DebugContractComponent } from './debug-contract/debug-contract/debug-contract.component';

import { HomeComponent } from './home/home/home.component';

const routes: Routes = [ { path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: 'home', component:  HomeComponent},
{ path: 'dashboard',   canActivate: [AuthGuard],component:  DashboardComponent},
{ path: 'debug',  canActivate: [AuthGuard], component:  DebugContractComponent},
{ path: 'dashboard/create-stream',   canActivate: [AuthGuard],component:  CreateStreamComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
