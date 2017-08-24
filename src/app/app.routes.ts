import {Routes} from "@angular/router";

import {Dashboard1Component} from "./views/dashboards/dashboard1.component";
import {Dashboard2Component} from "./views/dashboards/dashboard2.component";
import {Dashboard3Component} from "./views/dashboards/dashboard3.component";
import {Dashboard4Component} from "./views/dashboards/dashboard4.component";
import {Dashboard41Component} from "./views/dashboards/dashboard41.component";
import {Dashboard5Component} from "./views/dashboards/dashboard5.component";

import {StarterViewComponent} from "./views/appviews/starterview.component";
import {LoginComponent} from "./views/appviews/login.component";

import {RolesComponent} from './views/security/roles.component';
import {UsersComponent} from './views/security/user.component';
import {UserCreateComponent} from './views/security/user-create.component';
import {ChangePasswordComponent} from './views/security/change.component';
import {ClientComponent} from './views/clients/client.component';
import {ClientDataComponent} from './views/clients/client-data.component';
import {ClientsComponent} from './views/clients/clients.component';
import {AllProductsComponent} from './views/maintenance/all-products.component';
import {SpendingTypeComponent} from './views/maintenance/spending-type.component';
import {DetailMassiveChargeComponent} from './views/massive-files-charges/detail-massive-charge.component';
import {RequestsComponent} from './views/requests/requests.component';

import {BlankLayoutComponent} from "./components/common/layouts/blankLayout.component";
import {BasicLayoutComponent} from "./components/common/layouts/basicLayout.component";
import {TopNavigationLayoutComponent} from "./components/common/layouts/topNavigationlayout.component";

import { AuthGuard } from './helpers/authguard';

export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: 'starterview', pathMatch: 'full'},

  // App views
  {
    path: 'dashboards', component: BasicLayoutComponent,
    children: [
      {path: 'dashboard1', component: Dashboard1Component},
      {path: 'dashboard2', component: Dashboard2Component},
      {path: 'dashboard3', component: Dashboard3Component},
      {path: 'dashboard4', component: Dashboard4Component},
      {path: 'dashboard5', component: Dashboard5Component}
    ]
  },
  {
    path: 'dashboards', component: TopNavigationLayoutComponent,
    children: [
      {path: 'dashboard41', component: Dashboard41Component}
    ]
  },
  {
    path: 'seguridad', component: BasicLayoutComponent,
    children: [
      {path: 'roles', component: RolesComponent, canActivate: [AuthGuard]},
      {path: 'user', component: UsersComponent, canActivate: [AuthGuard]},
      {path: 'user-create/:username', component: UserCreateComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: 'solicitudes', component: BasicLayoutComponent,
    children: [
      {path: '', component: RequestsComponent, canActivate: [AuthGuard]}
    ]
  },
  {
    path:'clientes', component: BasicLayoutComponent,
    children: [
      {path: 'cliente/:id',  component: ClientComponent, canActivate: [AuthGuard]},
      {path: '', component: ClientsComponent, canActivate: [AuthGuard]}
    ]
  },
  {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {path: 'productos', component: AllProductsComponent, canActivate: [AuthGuard]},
      {path: 'tipos-gasto', component: SpendingTypeComponent, canActivate: [AuthGuard]}
    ]
  },
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'starterview', component: StarterViewComponent, canActivate: [AuthGuard]}
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'changepassword', component: ChangePasswordComponent }
    ]
  },
  {
    path: 'cargas-masivas', component: BasicLayoutComponent,
    children: [
      {path: 'detalle-carga', component: DetailMassiveChargeComponent, canActivate: [AuthGuard]}
    ]
  },

  // Handle all other routes
  {path: '**',  redirectTo: 'starterview'}
];
