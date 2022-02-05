import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateStreamComponent } from './create-stream/create-stream.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CreateStreamComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],

})
export class CreateStreamModule { }
