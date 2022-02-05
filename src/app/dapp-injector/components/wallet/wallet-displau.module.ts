import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


import {MatTabsModule} from '@angular/material/tabs';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { WalletDisplayComponent } from '..';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    WalletDisplayComponent
  ],
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,
    ClipboardModule


  ],
  providers:[],
  exports: [WalletDisplayComponent
  ]
})
export class WalletdisplaytModule { }
