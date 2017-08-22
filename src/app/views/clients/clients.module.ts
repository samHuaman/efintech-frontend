import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';
import { TabsModule } from 'ngx-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
import { LaddaModule } from 'angular2-ladda';
import { AlertModule } from 'ngx-bootstrap';
import { DropdownModule } from 'ngx-dropdown';

import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import { MyDataTablesModule } from '../../helpers/datatables/datatables.module';
import { MyDropdownModule } from '../../components/common/dropdown/dropdown.module';
import { AccountModule } from '../accounts/accounts.module';
import { WarrantyModule } from '../warrantys/warrantys.module';
import { AccountStatusModule } from '../AccountStatus/accountStatus.module';


import { ClientComponent } from './client.component';
import { ClientDataComponent } from './client-data.component';
import { ClientsComponent } from './clients.component';
import { ScheduleComponent } from './schedule.component';
import { ScheduleHistoryComponent } from './schedule-history.component';
import { PaymentComponent } from './payment.component';
import { SpendingComponent } from './spending.component';
import { MovementsComponent } from './movements.component';



@NgModule({
    declarations: [
        ClientComponent,
        ClientDataComponent,
        ClientsComponent,
        ScheduleComponent,
        ScheduleHistoryComponent,
        PaymentComponent,
        SpendingComponent,
        MovementsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        IboxtoolsModule,
        TabsModule.forRoot(),
        Select2Module,
        MyDatePickerModule,
        LaddaModule.forRoot({
            style: "zoom-in",
            spinnerSize: 40,
            spinnerColor: "white",
            spinnerLines: 12
        }),
        AlertModule.forRoot(),
        MyDataTablesModule,
        MyDropdownModule,
        DropdownModule,
        AccountModule,
        WarrantyModule,
        AccountStatusModule
    ],
    exports: [
        ClientComponent,
        ClientDataComponent,
        ClientsComponent,
        ScheduleComponent,
        ScheduleHistoryComponent,
        PaymentComponent,
        SpendingComponent,
        MovementsComponent
    ]
})

export class ClientModule {

}