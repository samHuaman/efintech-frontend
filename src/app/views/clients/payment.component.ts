import { Component } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Input, Output } from '@angular/core';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'payment',
    templateUrl: 'payment.component.html'
})

export class PaymentComponent implements OnInit, OnChanges {

    @Input() accountId: any;
    @Input() clientId: any;

    MyDatePickerOptions: IMyDpOptions;
    MyDatePickerModel: any = { };

    Client: any = { };

    public url: string;
    public columns: any[] = [];
    public filter: any = { };
    
    constructor(private _http: HttpRequestService) {

    }
    
    ngOnInit() {
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

        this.url = 'http://localhost:8080/payment/getPaymentDataTable';
        this.columns = [
            {
                title: 'ID Pago',
                data: 'payment_id',
                name: 'payment_id',
                responsivePriority: 0
            },
            {
                title: 'Nro. Couta',
                data: 'fee.fee_number',
                name: 'fee_number',
                responsivePriority: 1
            },
            {
                title: 'Importe Pagado',
                data: 'paid_amount',
                name: 'paid_amount',
                responsivePriority: 2
            },
            {
                title: 'Fecha de Transacción',
                data: 'transaction_date',
                name: 'transaction_date',
                responsivePriority: 3,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    return _date;
                }
            }
        ];

        this.getClient();
    }

    ngOnChanges() {

    }

    getClient() {
        let url: string = 'http://localhost:8080/client/findById?id=' + this.clientId;

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    this.Client = data._body ? JSON.parse(data._body) : { };
                    this.Client.fullname = 
                        this.Client.firstname + ' ' + 
                        this.Client.secondname + ', ' + 
                        this.Client.lastname_a + ' ' +
                        this.Client.lastname_b;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }
}