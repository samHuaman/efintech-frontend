import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyDataTablesComponent } from './datatables.component';
import { MyDataTablesAjaxComponent } from './datatables-ajax.component';

@NgModule({
    declarations: [
        MyDataTablesComponent,
        MyDataTablesAjaxComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        MyDataTablesComponent,
        MyDataTablesAjaxComponent
    ]
})

export class MyDataTablesModule {
    
}