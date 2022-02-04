import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugContractComponent } from './debug-contract/debug-contract/debug-contract.component';

import { HomeComponent } from './home/home/home.component';

const routes: Routes = [ { path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: 'home', component:  HomeComponent},
{ path: 'debug', component:  DebugContractComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
