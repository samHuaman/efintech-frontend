import { Component, EventEmitter } from '@angular/core';
import { OnInit, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Input, Output } from '@angular/core';
import { SecurityContext, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { URLSearchParams } from "@angular/http";

import { Select2OptionData } from 'ng2-select2';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { HttpRequestService } from '../../services/httprequest.service';

import 'jquery-slimscroll';

declare var jQuery: any;

@Component({
    selector: 'product-maintenance',
    templateUrl: 'product-maintenance.component.html'
})

export class ProductMaintenanceComponent implements OnInit, OnChanges, AfterViewChecked {
    
    @Input() snCreate: boolean = false;
    @Input() productId: any;
    @Output() dataSaved:EventEmitter<boolean> = new EventEmitter();
    
    ProductTypes: Array<Select2OptionData> = [];
    ProductTypesOptions: Select2Options;

    Currencies: Array<Select2OptionData> = [];
    CurrenciesOptionsPrincipal: Select2Options;
    CurrenciesOptionsSecundary: Select2Options;

    Plans: Array<Select2OptionData> = [];
    PlansOptions: Select2Options;
    SelectedPlans: any[];
    MultiSelect: any[];

    DatePickerOptions: IMyDpOptions;
    StartDPModel: any;
    EndDPModel: any;

    EditForm: FormGroup;  
    
    Product: any = { };

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
    
        this.getProductTypesData();
        this.getCurrenciesData();
        this.getPlansData();

        console.log(this.productId);
    }

    ngOnChanges() {
        
    }
        
    ngAfterViewInit() {
        jQuery('.scroll').slimscroll({
            height: '70%'
        });

        if (this.productId && !this.snCreate) {
            setTimeout(() => {
                this.getProduct();
            }, 750);
        }
    }

    ngAfterViewChecked() {
        this.changeRef.detectChanges();
    }

    getProduct() {
        this._http.getWithCredentials('http://localhost:8080/product/getProductById?id=' + this.productId)
            .subscribe(
                data => {
                    let _data = data._body ? JSON.parse(data._body) : { };
                    this.Product = _data;
                    
                    this.StartDPModel = {
                        date: {
                            year: new Date(_data.validity_start).toLocaleDateString().split('/')[2],
                            month: new Date(_data.validity_start).toLocaleDateString().split('/')[1],
                            day: new Date(_data.validity_start).toLocaleDateString().split('/')[0]
                        },
                        formatted: new Date(_data.validity_start).toLocaleDateString()
                    };

                    this.EndDPModel = {
                        date: {
                            year: new Date(_data.validity_end).toLocaleDateString().split('/')[2],
                            month: new Date(_data.validity_end).toLocaleDateString().split('/')[1],
                            day: new Date(_data.validity_end).toLocaleDateString().split('/')[0]
                        },
                        formatted: new Date(_data.validity_end).toLocaleDateString()
                    };

                    this.MultiSelect = _data.plans.map((plan: any) => plan.plan_id);                    
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    post() {
        if (this.EditForm.valid) {
            let data = new URLSearchParams();
            
            data.append('product_id', this.Product.product_id);
            data.append('description', this.Product.description);
            data.append('short_description', this.Product.short_description);
            data.append('productType.type_id', this.Product.productType.type_id);
            data.append('principalCurrency.currency_id', this.Product.principalCurrency ? this.Product.principalCurrency.currency_id : null);
            data.append('secundaryCurrency.currency_id', this.Product.secundaryCurrency ? this.Product.secundaryCurrency.currency_id : null);
            data.append('validity_start', this.StartDPModel.formatted || null);
            data.append('validity_end', this.EndDPModel.formatted || null);
            
            this.SelectedPlans.forEach(key => {
                data.append('_plans', key.plan_id);
            });

            this._http.postWithCredentials('http://localhost:8080/product/edit', data)
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

    getProductTypesData() {
        this.ProductTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Tipo de Producto'
            },
            dropdownParent: jQuery('.modal-body')
        };

        let url: string = 'http://localhost:8080/product/getAllProductTypes'
        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.type_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.ProductTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onProductTypeChange(event: any) {
        this.Product.productType = {
            type_id: event.value
        };
    }

    getCurrenciesData() {
        this.CurrenciesOptionsPrincipal = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Moneda Principal'
            },
            dropdownParent: jQuery('.modal-body')
        };

        this.CurrenciesOptionsSecundary = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Moneda Secundaria'
            },
            dropdownParent: jQuery('.modal-body')
        };

        let url: string = 'http://localhost:8080/product/getAllCurrencies'
        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.currency_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.Currencies = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onPrincipalCurrencyChange(event: any) {
        this.Product.principalCurrency = {
            currency_id: event.value
        };
    }

    onSecundaryCurrencyChange(event: any) {
        this.Product.secundaryCurrency = {
            currency_id: event.value
        };
    }

    onValidityStartChange(event: any) {
        this.StartDPModel.formatted = event.formatted;
    }

    onValidityEndChange(event: any) {
        this.EndDPModel.formatted = event.formatted;
    }

    getPlansData() {
        this.PlansOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            multiple: true,
            placeholder: {
                id: -1,
                text: 'Planes Asociados'
            },
            dropdownParent: jQuery('.modal-body')
        };

        let url: string = 'http://localhost:8080/product/getAllPlans'
        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.plan_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.Plans = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onChangePlans(event: any) {
        if (event.value.length > 0) {
            this.SelectedPlans = event.value.map((_plan: any) => ({
                plan_id: _plan
            }));
        }
        else {
            this.SelectedPlans = [];
        }
    }
}