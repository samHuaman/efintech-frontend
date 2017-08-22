import { Component, TemplateRef } from '@angular/core';
import { OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'products',
    templateUrl: 'products.component.html'
})

export class ProductsComponent implements OnInit, AfterViewChecked {

    public modalRef: BsModalRef;

    public url: string;
    public columns: any[];
    public filter: Object;

    public ProductSelected: any = { };

    ShowDropdown: boolean = false;
    SN_Create: boolean = true;
    SN_Data_Saved: boolean = false;

    constructor(private modalService: BsModalService,
                private changeRef: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.url = 'http://localhost:8080/product/getProductDataTable';

        this.columns = [
            {
                title: 'ID',
                data: 'product_id',
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
                title: 'Tipo',
                data: 'productType.description',
                name: 'productType',
                responsivePriority: 2
            },
            {
                title: 'Moneda Principal',
                data: 'principalCurrency.description',
                name: 'principalCurrency',
                responsivePriority: 3
            },
            {
                title: 'Moneda Secundaria',
                data: 'secundaryCurrency.description',
                name: 'secundaryCurrency',
                responsivePriority: 4
            },
            {
                title: 'Inicio de Vigencia',
                data: 'validity_start',
                name: 'validity_start',
                responsivePriority: 5,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    return _date;
                }
            },
            {
                title: 'Fin de Vigencia',
                data: 'validity_end',
                name: 'validity_end',
                responsivePriority: 6,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    return _date;
                }
            }
        ];
    }

    public ngAfterViewInit() {
        
    }

    public ngAfterViewChecked() {
        this.changeRef.detectChanges();
    }

    public onShowDropdown(event: any) {
        if (event) {
            this.ProductSelected = event;
            this.ShowDropdown = true;
        }
        else {
            this.ProductSelected = { };
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