import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RouterModule } from "@angular/router";
import { MyDatePickerModule } from 'mydatepicker';
import { DropdownModule } from 'ngx-dropdown';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { Select2Module } from 'ng2-select2';
import { LaddaModule } from 'angular2-ladda';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { ModalModule } from 'ngx-bootstrap';
/*import { DataTablesModule } from 'angular-datatables';*/

import { RolesComponent } from "./roles.component";
import { UsersComponent } from "./user.component";
import { UserCreateComponent } from "./user-create.component";
import { EnableDisableUsersComponent } from './enale-disable-users.component';
import { ChangePasswordComponent } from './change.component';
import { ResetPasswordComponent } from './reset.component';
import { SecDataFilterPipe } from './data-filter.pipe';
import { IboxIndexComponent } from '../../components/common/iboxtools/iboxtoolsindex.component';
import { ModalComponent } from '../../components/common/modal/modal.component';
import { MyDropdownModule } from '../../components/common/dropdown/dropdown.module';
import { MyDataTablesModule } from '../../helpers/datatables/datatables.module';
import { AppviewsModule } from '../appviews/appviews.module';

import { DataFilterPipe } from '../../helpers/data-filter.pipe';

import { PeityModule } from '../../components/charts/peity';
import { SparklineModule } from '../../components/charts/sparkline';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';

@NgModule({
  declarations: [
    RolesComponent,
    ChangePasswordComponent,
    UsersComponent,
    SecDataFilterPipe,
    ModalComponent,
    ResetPasswordComponent,
    UserCreateComponent,
    DataFilterPipe,
    EnableDisableUsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    IboxtoolsModule,
    Ng2Bs3ModalModule,
    ToastModule,
    Select2Module,
    MyDataTablesModule,
    /*DataTablesModule,*/
    LaddaModule.forRoot({
      style: "zoom-in",
      spinnerSize: 40,
      spinnerColor: "white",
      spinnerLines: 12
    }),
    MyDropdownModule,    
    DropdownModule,
    AppviewsModule,
    PasswordStrengthBarModule,
    ModalModule.forRoot()
  ],
  exports: [
    RolesComponent,
    ChangePasswordComponent,
    UsersComponent,
    ModalComponent,
    ResetPasswordComponent,
    UserCreateComponent,
    EnableDisableUsersComponent
  ],
})

export class SecurityModule {
}