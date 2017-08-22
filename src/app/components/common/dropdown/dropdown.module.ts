import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'ngx-dropdown';

import { MyDropdownComponent } from './dropdown.component';


@NgModule({
  declarations: [
    MyDropdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule
  ],
  exports: [
    MyDropdownComponent
  ],
})

export class MyDropdownModule {
}
