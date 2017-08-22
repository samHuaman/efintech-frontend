import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { COMPILER_PROVIDERS } from '@angular/compiler';
import { CommonModule }  from "@angular/common";
import { FormsModule }   from "@angular/forms";

// detail stuff
import { DynamicTypeBuilder }     from './type.builder';
import { DropdownTemplateBuilder } from './template-dropdown.builder';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [ ],
    exports: [ ],
    providers: [
        DynamicTypeBuilder,
        DropdownTemplateBuilder,
        /* COMPILER_PROVIDERS, */
        CommonModule,
        FormsModule
    ]
})
export class DynamicModule {
    
}