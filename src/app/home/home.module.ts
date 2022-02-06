import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Web3ModalModule } from '../web3-modal/web3-modal.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    Web3ModalModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
