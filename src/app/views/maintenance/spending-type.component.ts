import { Component, TemplateRef } from '@angular/core';
import { OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'spending-type',
    templateUrl: 'spending-type.component.html'
})

export class SpendingTypeComponent implements OnInit {

    public modalRef: BsModalRef;
    
    public url: string;
    public columns: any[];
    public filter: Object;

    public TypeSelected: any = { };

    ShowDropdown: boolean = false;
    SN_Create: boolean = true;
    SN_Data_Saved: boolean = false;

    constructor(private modalService: BsModalService,
                private changeRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        this.url = 'http://localhost:8080/spending/getSpendingTypeDataTable';
        this.columns = [
            {
                title: 'ID',
                data: 'type_id',
                name: 'type_id',
                responsivePriority: 0
            },
            {
                title: 'Descripción',
                data: 'description',
                name: 'description',
                responsivePriority: 1
            },
            {
                title: 'Descripción Reducida',
                data: 'short_description',
                name: 'short_description',
                responsivePriority: 2
            },
            {
                title: 'Grupo',
                data: 'groupType.description',
                name: 'groupType',
                responsivePriority: 3
            },
            {
                title: 'Moneda',
                data: 'currency.description',
                name: 'currency',
                responsivePriority: 4
            },
            {
                title: 'Monto Máximo',
                data: 'max_amount',
                name: 'max_amount',
                responsivePriority: 5
            },
            {
                title: 'Monto Mínimo',
                data: 'min_amount',
                name: 'min_amount',
                responsivePriority: 6
            }
        ];
    }
    
    public ngAfterViewChecked() {
        this.changeRef.detectChanges();
    }

    public onShowDropdown(event: any) {
        if (event) {
            this.TypeSelected = event;
            this.ShowDropdown = true;
        }
        else {
            this.TypeSelected = { };
            this.ShowDropdown = false;
        }
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public onDataSaved(event: any) {
        if (event == true) {
            this.SN_Data_Saved = true;
            this.ShowDropdown = false;
        }
    }

}