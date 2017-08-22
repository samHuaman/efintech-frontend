import { NgModule } from "@angular/core"

//componentes
import { AccountComponent } from './accounts.component';
//import { AccountDetailComponent } from './account-data.component';

//modulos
import { RouterModule } from "@angular/router";
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import { MyDataTablesModule } from '../../helpers/datatables/datatables.module';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { MyDropdownModule } from '../../components/common/dropdown/dropdown.module';
import { Select2Module } from 'ng2-select2';

@NgModule({
    declarations: [
        AccountComponent,
        //AccountDetailComponent
    ],
    imports: [
        IboxtoolsModule,
        MyDataTablesModule,
        BrowserModule,
        FormsModule,
        MyDatePickerModule,
        MyDropdownModule,
        Select2Module,
        BrowserAnimationsModule
    ],
    exports: [
        AccountComponent,
        //AccountDetailComponent
    ]
})

export class AccountModule {}