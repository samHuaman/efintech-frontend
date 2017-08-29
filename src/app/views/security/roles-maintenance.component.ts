import { Component } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Input, Output } from '@angular/core';

@Component({
    selector: 'roles-maintenance',
    templateUrl: 'roles-maintenance.component.html'
})

export class RolesMaintenance implements OnInit, OnChanges {
    
    @Input() roleId: any;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges() {

    }

}