import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Web3ModalModule } from '../web3-modal/web3-modal.module';
import { WalletdisplaytModule } from '../dapp-injector/components/wallet/wallet-displau.module';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,Web3ModalModule,
    WalletdisplaytModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
