import { Component, TemplateRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { Select2OptionData } from 'ng2-select2';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';

import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'spending',
    templateUrl: 'spending.component.html'
})

export class SpendingComponent implements OnInit {

    @Input() clientId: any;

    MyDatePickerOptions: IMyDpOptions;
    MyDatePickerModel: any = { };

    SpendingTypes: Array<Select2OptionData> = [];
    SpendingTypesOptions: Select2Options;

    ShowDropdown: boolean = false;
    SN_Create: boolean = true;
    SN_Data_Saved: boolean = false;

    SpendingSelected: any = { };

    public modalRef: BsModalRef;

    public url: string;
    public columns: any[] = [];
    public filter: any = { };

    constructor(private _http: HttpRequestService,
                private modalService: BsModalService) {
        
    }

    ngOnInit() {
        this.getSpendingTypes();

        this.MyDatePickerOptions  = {
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

        this.url = 'http://localhost:8080/spending/getSpendingDataTableByClient?client_id=' + this.clientId;

        this.columns = [
            {
                title: 'ID Gasto',
                data: 'spending_id',
                name: 'spending_id',
                responsivePriority: 0
            },
            {
                title: 'Tipo Gasto',
                data: 'spendingType.description',
                name: 'spendingType',
                responsivePriority: 1
            },
            {
                title: 'Monto Gasto',
                data: 'spending_amount',
                name: 'spending_amount',
                responsivePriority: 2
            },
            {
                title: 'Fecha de Registro',
                data: 'registration_date',
                name: 'registration_date',
                responsivePriority: 3,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    return _date;
                }
            },
            {
                title: 'Estado',
                data: 'status',
                name: 'status',
                responsivePriority: 4,
                render: function (data, tye, full, meta) {
                    let str: string = '';
                    
                    if (data == 1) {
                        str = 'Activo';
                    }
                    else {
                        str = 'Inactivo';
                    }

                    return str;
                }
            }
        ];
    }

    getSpendingTypes() {
        this.SpendingTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Gasto'
            }
        };

        let url = 'http://localhost:8080/spending/getAllSpendingTypes';
        
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

                    this.SpendingTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }
    
    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public onShowDropdown(event: any) {
        if (event) {
            this.SpendingSelected = event;
            this.ShowDropdown = true;
        }
        else {
            this.SpendingSelected = null;
            this.ShowDropdown = false;
        }
    }
}