import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HomeModule } from './home/home.module';
import { MatButtonModule } from '@angular/material/button';
import { blockchain_imports, blockchain_providers } from './blockchain_wiring';
import { OnChainService } from './on-chain.service';

import { DebugContractModule } from './debug-contract/debug-contract.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
     //@dev AngularCore
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,


    // @dev Features modulesto Work with
    HomeModule,

    //@dev angular-web3 infrastructure
    ...blockchain_imports,

    //@dev Angular materail
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    DebugContractModule,
    MatProgressSpinnerModule
  ],
  providers: [  ...blockchain_providers, OnChainService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
