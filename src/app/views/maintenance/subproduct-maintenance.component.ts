import { Component, EventEmitter } from '@angular/core';
import { OnInit, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Input, Output, ViewChild } from '@angular/core';
import { SecurityContext, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { URLSearchParams } from "@angular/http";

import { Select2OptionData, Select2Component } from 'ng2-select2';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { HttpRequestService } from '../../services/httprequest.service';

import 'jquery-slimscroll';

declare var jQuery: any;

@Component({
    selector: 'subproduct-maintenance',
    templateUrl: 'subproduct-maintenance.component.html'
})

export class SubProductMaintenanceComponent implements OnInit, OnChanges, AfterViewChecked {

    @Input() snCreate: boolean = false;
    @Input() subProductId: any;
    @Output() dataSaved:EventEmitter<boolean> = new EventEmitter();

    ProductsAjax: Select2AjaxOptions;
    ProductOptions: Select2Options;

    DatePickerOptions: IMyDpOptions;
    StartDPModel: any;
    EndDPModel: any;

    EditForm: FormGroup;  
    
    SubProduct: any = { };

    public alerts: any[] = [];
    
    constructor(private _http: HttpRequestService,
                private sanitizer: DomSanitizer,
                private formBuilder: FormBuilder,
                private changeRef: ChangeDetectorRef) {
        this._http.progress$.subscribe(
            data => {
                console.log('progress = ' + data);
            }
        );
    }
        
    ngOnInit() {
        this.EditForm = this.formBuilder.group({
            'Description': [null, Validators.required],
            'ShortDescription': [null, null],
            'ValidityStart': [null, null],
            'ValidityEnd': [null, null]
        });

        this.DatePickerOptions = {
            dayLabels: {
                su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'
            },
            monthLabels: {
                1: 'Ene', 
                2: 'Feb', 
                3: 'Mar', 
                4: 'Abr', 
                5: 'May', 
                6: 'Jun', 
                7: 'Jul', 
                8: 'Ago', 
                9: 'Sep', 
                10: 'Oct', 
                11: 'Nov', 
                12: 'Dic' 
            },
            todayBtnTxt: 'Hoy',
            editableDateField: false,
            openSelectorOnInputClick: true,
            dateFormat: 'dd/mm/yyyy'
        };

        this.StartDPModel = { 
            date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() } ,
            formatted: new Date().toLocaleDateString()
        };
        this.EndDPModel = { 
            date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() } ,
            formatted: new Date().toLocaleDateString()
        };

        this.alerts = this.alerts.map((alert: any) => ({
            type: alert.type,
            msg: this.sanitizer.sanitize(SecurityContext.HTML, alert.msg),
            timeout: 3000
        }));

        if (this.subProductId && !this.snCreate) {
            setTimeout(() => {
                this.getSubProduct();
            }, 750);
        }
    
        this.getProductsData();
    
        console.log(this.subProductId);
    }

    ngOnChanges() {
        
    }
        
    ngAfterViewInit() {
        jQuery('.scroll').slimscroll({
            height: '70%'
        });
    }

    ngAfterViewChecked() {
        /* this.changeRef.detectChanges(); */
    }

    getSubProduct() {
        this._http.getWithCredentials('http://localhost:8080/product/getSubProductById?id=' + this.subProductId)
            .subscribe(
                data => {
                    this.SubProduct = data._body ? JSON.parse(data._body) : { };

                    if (this.SubProduct.product != null) {  
                        console.log(this.ProductOptions);  

                        this.ProductOptions.data = [{
                            id: this.SubProduct.product.product_id,
                            text: this.SubProduct.product.description
                        }];
                    }
                
                    this.StartDPModel = this.SubProduct.validity_start != null ? {
                        date: {
                            year: new Date(this.SubProduct.validity_start).toLocaleDateString().split('/')[2],
                            month: new Date(this.SubProduct.validity_start).toLocaleDateString().split('/')[1],
                            day: new Date(this.SubProduct.validity_start).toLocaleDateString().split('/')[0]
                        },
                        formatted: new Date(this.SubProduct.validity_start).toLocaleDateString()
                    } : 
                    {
                        date: this.StartDPModel,
                        formatted: ''
                    };

                    this.EndDPModel = this.SubProduct.validity_end != null ? {
                        date: {
                            year: new Date(this.SubProduct.validity_end).toLocaleDateString().split('/')[2],
                            month: new Date(this.SubProduct.validity_end).toLocaleDateString().split('/')[1],
                            day: new Date(this.SubProduct.validity_end).toLocaleDateString().split('/')[0]
                        },
                        formatted: new Date(this.SubProduct.validity_end).toLocaleDateString()
                    } : 
                    {
                        date: this.EndDPModel,
                        formatted: ''
                    };
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    post() {
        if (this.EditForm.valid) {
            let data = new URLSearchParams();
            
            data.append('sub_product_id', this.SubProduct.sub_product_id);
            data.append('description', this.SubProduct.description);
            data.append('short_description', this.SubProduct.short_description);
            data.append('product.product_id', this.SubProduct.product.product_id);
            data.append('validity_start', this.StartDPModel.formatted || null);
            data.append('validity_end', this.EndDPModel.formatted || null);
            
            this._http.postWithCredentials('http://localhost:8080/product/editSubProduct', data)
                .subscribe(
                    _data => {
                        let res = JSON.parse(_data._body);

                        setTimeout(() => {
                            this.dataSaved.emit(true);

                            if (res.statusCode == 200) {
                                this.alerts.push({
                                    type: 'success',
                                    msg:`<strong>Guardado!</strong> Los cambios se guardaron exitosamente.`,
                                    timeout: 6000
                                });
                            }
                            else if(res.statusCode == 400) {
                                this.alerts.push({
                                    type: 'warning',
                                    msg:`<strong>Alerta!</strong> Hubo un problema al intentar guardar los cambios. Por favor, inténtelo nuevamente.`,
                                    timeout: 6000
                                });
                            }
                            else {
                                this.alerts.push({
                                    type: 'danger',
                                    msg:`<strong>Error!</strong> Hubo un error en el servidor. Por favor, comuníquese con el Administrador del Sistema.`,
                                    timeout: 6000
                                });
                            }
                        }, 750);

                        console.log(res);
                    },
                    error => {
                        this.alerts.push({
                            type: 'danger',
                            msg:`<strong>Error!</strong> Hubo un error en el servidor. Por favor, comuníquese con el Administrador del Sistema.`,
                            timeout: 6000
                        });

                        console.log(error);
                    },
                    () => console.log('Request Finished')
                );
        }
    }

    getProductsData() {
        this.ProductsAjax = {
            url: 'http://localhost:8080/product/searchProducts',
            dataType: 'json',
            delay: 500,
            cache: true,
            data: (term, page, context) => {
                return {
                    query: term.term,
                    page: term.page,
                    pageLimit: 20
                };
            },
            processResults: (data, params) => {
                params.page = params.page || 1;
                
                let _data = (data.items);
                let array: any[] = [];
                
                _data.forEach(obj => {
                    let _obj = {
                        id: obj.product_id,
                        text: obj.description
                    };

                    array.push(_obj);
                });
                
                let res = {
                    results: array,
                    pagination: {
                        more: (params.page * 20) < data.total
                    }
                };

                return res;
            }
        };

        this.ProductOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            minimumInputLength: 3,
            placeholder: {
                id: -1,
                text: 'Producto'
            },
            ajax: this.ProductsAjax,
            dropdownParent: jQuery('.modal-body')            
        };
    }

    onProductsChange(event: any) {
        this.SubProduct.product = {
            product_id: event.value
        };
    }

    onValidityStartChange(event: IMyDateModel) {
        this.StartDPModel.formatted = event.formatted;
    }

    onValidityEndChange(event: IMyDateModel) {
        this.EndDPModel.formatted = event.formatted;
    }

}
