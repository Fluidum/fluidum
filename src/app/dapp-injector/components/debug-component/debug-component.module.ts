import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractInputComponent } from './contract-input/contract-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


import {MatTabsModule} from '@angular/material/tabs';
import { DebugComponent } from './debug-component/debug.component';


@NgModule({
  declarations: [DebugComponent,
    ContractInputComponent,
 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,

  ],
    exports: [DebugComponent
  ]
})
export class DebugComponentModule { }
