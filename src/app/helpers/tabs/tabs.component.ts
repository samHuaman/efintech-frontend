import { Component } from '@angular/core';

@Component({
    selector: 'tabs',
    template: `
        <ul>
            <li>Tab 1</li>
            <li>Tab 2</li>
        </ul>
        <ng-content></ng-content>
    `
})

export class Tabs {

}