import { Injectable } from '@angular/core';

@Injectable()
export class DropdownTemplateBuilder {
    public prepareTemplate(array: any[]) {
         let template = `<div class="dropdown pull-right" style="width: 23px; margin: 0px;" dropdown>                
    <a dropdown-open>
        <i class="fa fa-th-list text-navy"></i>
    </a>
    <ul class="dropdown-menu dropdown-menu-right">`;
        
        array.forEach(element => {
            if (element.type == 'REDIRECT') {
                template += `
        <li>
            <a [routerLink]="['${element.url}/${element.param}']">${element.name}</a>
        </li>`;
            }
            else if (element.type == 'MODAL') {
                template += `
        <li>
            <a (click)="${element.modal}">${element.name}</a>
        </li>`;
            }
        });

        template += `
    </ul>
</div>
        `;

        return template;
    }
}