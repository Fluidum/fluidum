import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeModule } from './home/home.module';

import { blockchain_imports, blockchain_providers } from './blockchain_wiring';
import { OnChainService } from './on-chain.service';

import { DebugContractModule } from './debug-contract/debug-contract.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardModule } from './dashboard/dashboard.module';
import { NavigationModule } from './navigation/navigation.module';
import { CreateStreamModule } from './create-stream/create-stream.module';
import { HttpClientModule } from '@angular/common/http';
import { Web3ModalModule } from './web3-modal/web3-modal.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
     //@dev AngularCore
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,


    // @dev Features modulesto Work with
    HomeModule,
    DashboardModule,
    NavigationModule,
    DebugContractModule,
    CreateStreamModule,

    //@dev angular-web3 infrastructure
    ...blockchain_imports,

    //@dev Angular materail
    MatProgressSpinnerModule,
  
  ],
  providers: [  ...blockchain_providers, OnChainService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
