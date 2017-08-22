import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { DropdownModule } from 'ngx-dropdown';
import { ModalModule } from 'ngx-bootstrap';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { Select2Module } from 'ng2-select2';
import { MyDatePickerModule } from 'mydatepicker';
import { AlertModule } from 'ngx-bootstrap';

import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import { MyDataTablesModule } from '../../helpers/datatables/datatables.module';
import { MyDropdownModule } from '../../components/common/dropdown/dropdown.module';

import { AllProductsComponent } from './all-products.component';
import { ProductsComponent } from './products.component';
import { ProductMaintenanceComponent } from './product-maintenance.component';
import { SubProductsComponent } from './subproducts.component';
import { SubProductMaintenanceComponent } from './subproduct-maintenance.component';
import { SpendingTypeComponent } from './spending-type.component';
import { SpendingTypeMaintenanceComponent } from './spending-type-maintenance.component';

@NgModule({
    declarations: [
        AllProductsComponent,
        ProductsComponent,
        ProductMaintenanceComponent,
        SubProductsComponent,
        SubProductMaintenanceComponent,
        SpendingTypeComponent,
        SpendingTypeMaintenanceComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MyDataTablesModule,
        MyDropdownModule,
        DropdownModule,
        IboxtoolsModule,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        NgSlimScrollModule,
        Select2Module,
        MyDatePickerModule,
        AlertModule.forRoot()
    ],
    exports: [
        AllProductsComponent,
        ProductsComponent,
        ProductMaintenanceComponent,
        SubProductsComponent,
        SubProductMaintenanceComponent,
        SpendingTypeComponent,
        SpendingTypeMaintenanceComponent
    ]
})

export class MaintenanceModule {

}