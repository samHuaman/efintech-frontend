import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2FileDropModule } from 'ng2-file-drop';
import { Select2Module } from 'ng2-select2';
import { AlertModule } from 'ngx-bootstrap';
import { LaddaModule } from 'angular2-ladda';

import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';

import { DetailMassiveChargeComponent } from './detail-massive-charge.component';

@NgModule({
    declarations: [
        DetailMassiveChargeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2FileDropModule,
        IboxtoolsModule,
        Select2Module,
        AlertModule.forRoot(),
        LaddaModule.forRoot({
            style: "zoom-in",
            spinnerSize: 40,
            spinnerColor: "white",
            spinnerLines: 12
        })
    ],
    exports: [
        DetailMassiveChargeComponent
    ]
})

export class MassiveChargesModule {

}