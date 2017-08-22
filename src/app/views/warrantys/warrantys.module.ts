import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Select2Module } from 'ng2-select2';

import { WarrantyComponent } from './warrantys.component';

import { MyDataTablesModule } from '../../helpers/datatables/datatables.module';
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import { MyDropdownModule } from '../../components/common/dropdown/dropdown.module';

@NgModule({
    declarations: [
        WarrantyComponent
        
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MyDataTablesModule,
        IboxtoolsModule,
        Select2Module,
        MyDropdownModule
    ],
    exports: [
        WarrantyComponent
        
    ]
})

export class WarrantyModule {}

