import { Component, ComponentFactory, NgModule, Input, Injectable, Compiler } from '@angular/core';
/* import { JitCompiler } from '@angular/compiler'; */
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ngx-dropdown';

import * as _ from 'lodash';

export interface IHaveDynamicData {
    entity: any;
}

@Injectable()
export class DynamicTypeBuilder {
    constructor (protected compiler: Compiler) {

    }

    private _cacheOffFactories: {[templateKey: string]: ComponentFactory<IHaveDynamicData>} = {};

    public createComponentFactory(template: string): Promise<ComponentFactory<IHaveDynamicData>> {
        let factory = this._cacheOffFactories[template];

        if (factory) {
            console.log('Module and Type are returned from cache');

            return new Promise((resolve) => {
                resolve(factory);
            });
        }

        let type = this.createNewComponent(template);
        let module = this.createComponentModule(type);

        return new Promise((resolve) => {
            this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) => {
                    factory = _.find(moduleWithFactories.componentFactories, { componentType: type });
                    this._cacheOffFactories[template] = factory;

                    resolve(factory);
                });
        });
    }

    protected createNewComponent(tmpl: string) {
        @Component({
            selector: 'dynamic-component',
            template: tmpl
        })
        class CustomDynamicComponent implements IHaveDynamicData {
            @Input() public entity: any
        };

        return CustomDynamicComponent;
    }

    protected createComponentModule(componentType: any) {
         @NgModule({
             imports: [
                 RouterModule,
                 DropdownModule
             ],
             declarations: [
                 componentType
             ]
         })
         class RuntimeComponentModule {

         }

         return RuntimeComponentModule;
    }
}