import { Component, EventEmitter } from '@angular/core';
import { OnInit, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Input, Output } from '@angular/core';
import { SecurityContext, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { URLSearchParams } from "@angular/http";

import { Select2OptionData } from 'ng2-select2';

import { HttpRequestService } from '../../services/httprequest.service';

import 'jquery-slimscroll';

declare var jQuery: any;

@Component({
    selector: 'spending-type-maintenance',
    templateUrl: 'spending-type-maintenance.html'
})

export class SpendingTypeMaintenanceComponent implements OnInit, OnChanges, AfterViewChecked {

    @Input() snCreate: boolean = false;
    @Input() typeId: any;
    @Output() dataSaved:EventEmitter<boolean> = new EventEmitter();

    Groups: Array<Select2OptionData> = [];
    GroupsOptions: Select2Options;

    Currencies: Array<Select2OptionData> = [];
    CurrenciesOptions: Select2Options;

    SpendingType: any = { };

    EditForm: FormGroup;

    public alerts: any[] = [];

    constructor(private _http: HttpRequestService,
                private formBuilder: FormBuilder,
                private sanitizer: DomSanitizer,
                private changeRef: ChangeDetectorRef) {
        this._http.progress$.subscribe(
            data => {
                console.log('progress = ' + data);
            }
        );

        this.alerts = this.alerts.map((alert: any) => ({
            type: alert.type,
            msg: sanitizer.sanitize(SecurityContext.HTML, alert.msg),
            timeout: 3000
        }));
    }

    ngOnInit() {
        this.EditForm = this.formBuilder.group({
            'Description': [null, Validators.required],
            'ShortDescription': [null, null],
            'MinAmount': [null, null],
            'MaxAmount': [null, null]
        });

        this.getGroups();
        this.getCurrencies();
    }

    ngOnChanges() {

    }

    ngAfterViewInit() {
        jQuery('.scroll').slimscroll({
            height: '70%'
        });

        if (this.typeId && !this.snCreate) {
            setTimeout(() => {
                this.getSpendingType();
            }, 750);
        }
    }


    ngAfterViewChecked() {
        this.changeRef.detectChanges();
    }

    getSpendingType() {
        let url: string = 'http://localhost:8080/spending/getSpendingTypeById?id=' + this.typeId;

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    this.SpendingType = data._body ? JSON.parse(data._body) : { };
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    post() {
        let url: string = 'http://localhost:8080/spending/editType';
        let data = new URLSearchParams();

        data.append('type_id', this.SpendingType.type_id);
        data.append('description', this.SpendingType.description);
        data.append('short_description', this.SpendingType.short_description);
        data.append('groupType.group_type_id', this.SpendingType.groupType.group_type_id);
        data.append('currency.currency_id', this.SpendingType.currency.currency_id);
        data.append('min_amount', this.SpendingType.min_amount);
        data.append('max_amount', this.SpendingType.max_amount);
        data.append('status', this.SpendingType.status);
        
        this._http.postWithCredentials(url, data)
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

    getGroups() {
        this.GroupsOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Grupo'
            },
            dropdownParent: jQuery('.modal-body')
        };

        let url: string = 'http://localhost:8080/spending/getAllGroups'
        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.group_type_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.Groups = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onGroupsChange(event: any) {
        this.SpendingType.groupType = {
            group_type_id: event.value
        };
    }

    getCurrencies() {
        this.CurrenciesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Moneda'
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

    onCurrenciesChange(event: any) {
        this.SpendingType.currency = {
            currency_id: event.value
        };
    }

    onStatusChange(event: any) {
        if (event.target.checked) {
            this.SpendingType.status = '1';
        }
        else {
            this.SpendingType.status = '0';
        }
    }
}