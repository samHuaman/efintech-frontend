import { Component} from '@angular/core';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
    selector: 'all-products',
    templateUrl: 'all-products.component.html'
})

export class AllProductsComponent implements OnInit {

    Tabs: number;

    constructor () {

    }

    ngOnInit() {
        this.Tabs = 1;
    }

    onSelectTab(num: number) {
        this.Tabs = num;
    }
}