import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import { MyDataTablesModule } from '../../helpers/datatables/datatables.module';
import { MyDropdownModule } from '../../components/common/dropdown/dropdown.module';

import { RequestsComponent } from './requests.component';

@NgModule({
    declarations: [ 
        RequestsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MyDropdownModule,
        IboxtoolsModule,
        MyDataTablesModule
    ],
    exports: [
        RequestsComponent
    ]
})

export class RequestsModule {

}