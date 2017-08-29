import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { FlotChartDirective } from '../../components/charts/flotChart';
import { HttpRequestService } from '../../services/httprequest.service';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

declare var jQuery:any;

@Component({
    selector: 'roles',
    templateUrl: 'roles.component.html'
})

export class RolesComponent implements OnDestroy, OnInit {

    public modalRef: BsModalRef;
    
    public filter: any = { };
    public url: string;
    public columns: any[];

    public ShowDropdown: boolean = false;
    public SelectedRole: any = {};

    constructor(private modalService: BsModalService) {

    }

    public ngOnInit(): void {
        this.url = 'http://localhost:8080/role/getRoleDataTable';
        this.columns = [
            { 
                title: 'Id', 
                data: 'role_id'
            },
            { 
                title: 'Descripción', 
                data: 'description'
            },
            {
                title: 'Alias', 
                data: 'alias'
            }
        ];
    }

    public ngOnDestroy(): any {

    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public onShowDropdown(event: any) {
        if (event) {
            this.SelectedRole = event;
            this.ShowDropdown = true;
        }
        else {
            this.SelectedRole = null;
            this.ShowDropdown = false;
        }
    }

}