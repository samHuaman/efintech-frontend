import { Component } from '@angular/core';

@Component({
    selector: 'my-dropdown',
    template: `
        <div class="dropdown pull-right" dropdown>
            <a dropdown-open>
                <i class="fa fa-th-list text-navy"></i>
            </a>            
            <ng-content select=".dopdown-list"></ng-content>            
        </div>
    `
})

export class MyDropdownComponent {

}