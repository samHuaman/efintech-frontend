import { Component, TemplateRef } from '@angular/core';
import { OnInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'sub-products',
    templateUrl: 'subproducts.component.html'
})

export class SubProductsComponent implements OnInit, AfterViewChecked {

    public modalRef: BsModalRef;
    
    public url: string;
    public columns: any[];
    public filter: Object;

    public SubProductSelected: any = { };

    ShowDropdown: boolean = false;
    SN_Create: boolean = true;
    SN_Data_Saved: boolean = false;

    constructor(private modalService: BsModalService,
                private changeRef: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.url = 'http://localhost:8080/product/getSubProductDataTable';

        this.columns = [
            {
                title: 'ID',
                data: 'sub_product_id',
                name: 'product_id',
                responsivePriority: 0
            },
            {
                title: 'Descripción',
                data: 'description',
                name: 'description',
                responsivePriority: 1
            },
            {
                title: 'Producto',
                data: 'product.description',
                name: 'product',
                responsivePriority: 2
            },
            {
                title: 'Inicio de Vigencia',
                data: 'validity_start',
                name: 'validity_start',
                responsivePriority: 3,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    return _date;
                }
            },
            {
                title: 'Fin de Vigencia',
                data: 'validity_end',
                name: 'validity_end',
                responsivePriority: 4,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    return _date;
                }
            }
        ];
    }

    public ngAfterViewChecked() {
        this.changeRef.detectChanges();
    }
    
    public onShowDropdown(event: any) {
        if (event) {
            this.SubProductSelected = event;
            this.ShowDropdown = true;
        }
        else {
            this.SubProductSelected = { };
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
