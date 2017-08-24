import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DropdownModule } from 'ngx-dropdown';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ROUTES } from "./app.routes";
import { AppComponent } from './app.component';

// App views
import { DashboardsModule } from "./views/dashboards/dashboards.module";
import { AppviewsModule } from "./views/appviews/appviews.module";
import { SecurityModule } from './views/security/security.module';
import { ClientModule } from './views/clients/clients.module';
import { MaintenanceModule } from './views/maintenance/maintenance.module';
import { MassiveChargesModule } from './views/massive-files-charges/massive-files-charges.module';
import { AccountModule } from './views/accounts/accounts.module';
import { WarrantyModule } from './views/warrantys/warrantys.module';
import { AccountStatusModule } from './views/AccountStatus/accountStatus.module';
import { RequestsModule } from './views/requests/requests.module';



// App modules/components
import { LayoutsModule } from "./components/common/layouts/layouts.module";

import { AuthGuard } from './helpers/authguard';

import { HttpRequestService } from './services/httprequest.service';
import { MenuService } from './services/menu.service';
import { UserService } from './services/user.service';
import { DynamicModule } from './helpers/dynamic/dynamic.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DashboardsModule,
    LayoutsModule,
    AppviewsModule,
    ClientModule,
    RouterModule.forRoot(ROUTES),
    SecurityModule,
    MaintenanceModule,
    DropdownModule,
    Ng2Bs3ModalModule,
    DynamicModule,
    ToastModule.forRoot(),
    FlashMessagesModule,
    MassiveChargesModule,
    AccountModule,
    WarrantyModule,
    AccountStatusModule,
    RequestsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    HttpRequestService,
    MenuService,
    UserService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
