import { NgModule } from "@angular/core"

import { AccountStatusComponent } from './accountStatus.component';

import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import { MyDropdownModule } from '../../components/common/dropdown/dropdown.module';
import { MyDataTablesModule } from '../../helpers/datatables/datatables.module';

@NgModule({
    declarations: [
       AccountStatusComponent
    ],
    imports: [
        IboxtoolsModule,
        MyDropdownModule,
        MyDataTablesModule
    ],
    exports: [
        AccountStatusComponent
    ]
})

export class AccountStatusModule {}