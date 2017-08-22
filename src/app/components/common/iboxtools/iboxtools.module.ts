import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BsDropdownModule} from 'ngx-bootstrap';

import {IboxtoolsComponent} from "./iboxtools.component";
import {IboxIndexComponent} from './iboxtoolsindex.component';

@NgModule({
  declarations: [IboxtoolsComponent, IboxIndexComponent],
  imports     : [BrowserModule,BsDropdownModule.forRoot()],
  exports     : [IboxtoolsComponent, IboxIndexComponent],
})

export class IboxtoolsModule {}
