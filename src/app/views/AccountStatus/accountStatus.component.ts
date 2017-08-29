import { Component, OnInit, OnChanges } from "@angular/core";
import { Input } from '@angular/core';
import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'accountStatus',
    templateUrl: 'accountStatus.component.html'
})

export class AccountStatusComponent implements OnInit, OnChanges {

     //DataTable
    @Input() accountId: any;
    public _accountStatusURL: string;
    public _accountStatusCoulumns: any[] = [];

    public quotaId: any;
    public _quotaURL: string;
    public _quotaColumns: any[] = [];


    //Client
    @Input() clientId: any;
    _clientURL: string;
    _client: any = {};
    _fullName: any;
    _documento:any;
    _direccion:any;
    _clienteAddressURL: string;
    _clientA: any = {};
    _accountURL: string;
    _account: any = {};
    _accountNumber:any;
    _accountProduct:any;

     constructor(private _httpRequestService: HttpRequestService){

     }

    ngOnInit(){
        this._accountStatusURL = 'http://localhost:8080/accountStatus/getAccountStatusDataTableByAccountId?accountId=' + this.accountId;
        this._accountStatusCoulumns = [
            {
                title: 'Fecha Operación',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 1,
                render: function (data, tye, full, meta) {
                                let _date = new Date(data).toLocaleDateString();
                                return _date;
                }
            },
            {
                title: 'Descripción',
                data: 'description',
                name: 'description',
                responsivePriority: 2
            },
            {
                title: 'Oficina',
                data: 'office',
                name: 'office',
                responsivePriority: 3
            },
            {
                title: 'Canal',
                data: 'canal',
                name: 'canal',
                responsivePriority: 4
            },
            {
                title: 'Operación',
                data: 'operation',
                name: 'operation',
                responsivePriority: 5
            },
            {
                title: 'Pago',
                data: 'pay',
                name: 'pay',
                responsivePriority: 6
            },
            {
                title: 'ITF',
                data: 'itf',
                name: 'itf',
                responsivePriority: 7
            },
            {
                title: 'Contable',
                data: 'accountant',
                name: 'accountant',
                responsivePriority: 8
            }
        ]

        //trae datos del cliente
        this._clientURL = 'http://localhost:8080/client/getClientContactInfo?client_id=' + this.clientId;
        if (this.clientId > 0 && this.clientId != null) {
            this._httpRequestService.getWithCredentials(this._clientURL)
                .subscribe(
                _data => {
                    this._client = JSON.parse(_data._body);
                    this._fullName = this._client.client.firstname + ' ' + this._client.client.secondname + ' ' + this._client.client.lastname_a + ' ' + this._client.client.lastname_b;
                    this._documento = this._client.client.document_number;
                    // this._direccion = this._client.client.
                }
                )
        }
        
        this._clienteAddressURL ='http://localhost:8080/client/getClientAddress?client_id=' + this.clientId + '&type_id=' + 1;
        if(this.clientId > 0 && this.clientId != null){
            this._httpRequestService.getWithCredentials(this._clienteAddressURL)
            .subscribe(
                _data => {
                   this._clientA = JSON.parse(_data._body);
                    this._direccion = this._clientA.zone_name + ' ' + this._clientA.road_number + ' ' + this._clientA.block + ',' + ' ' + this._clientA.ubigeo.district + ' ' + this._clientA.ubigeo.province;
                }
            )
        }

        this._accountURL = 'http://localhost:8080/account/getAccountDetailByAccountId?accountId=' + this.accountId;
         if (this.accountId > 0 && this.accountId != null){
            this._httpRequestService.getWithCredentials(this._accountURL)
            .subscribe(
                _data => {
                    this._account = JSON.parse(_data._body);
                    console.log(this._account);
                    this._accountNumber = this._account.aaccount;
                    this._accountProduct = this._account.product_id.description;
                }
            )
         }

        this.quotaId=1;
        this._quotaURL = 'http://localhost:8080/accountStatus/getFeeDataTableByScheduleId?schedule_id=' + this.quotaId;
        this._quotaColumns = [
            {
                title: 'Nro. Cuota',
                data: 'fee_number',
                name: 'fee_number',
                responsivePriority: 1
            },
            {
                title: 'Fec. Vencimiento',
                data: 'expiration_date',
                name: 'expiration_date',
                responsivePriority: 2,
                render: function (data, tye, full, meta) {
                                let _date = new Date(data).toLocaleDateString();
                                return _date;
                }
            },
            {
                title: 'Capital',
                data: 'capital',
                name: 'capital',
                responsivePriority: 3
            },
            {
                title: 'Interes compensatorio',
                data: 'compensatory_interest',
                name: 'compensatory_interest',
                responsivePriority: 4
            },
            {
                title: 'Interes moratorio',
                data: 'arrears_interest',
                name: 'arrears_interest',
                responsivePriority: 5
            },
            {
                title: 'Portes',
                data: 'monthly_commissions',
                name: 'monthly_commissions',
                responsivePriority: 6
            },
            {
                title: 'Total de cuota',
                data: 'total_fee',
                name: 'total_fee',
                responsivePriority: 7
            },
            {
                title: 'Seguro Desgravamen',
                data: 'disgrace_insurance',
                name: 'disgrace_insurance',
                responsivePriority: 8
            },
            {
                title: 'Otros seguros',
                data: 'other_insurance',
                name: 'other_insurance',
                responsivePriority: 9
            },
            {
                title: 'Total a Pagar',
                data: 'total_pay',
                name: 'total_pay',
                responsivePriority: 10
            }
        ]
    }

    ngOnChanges(){
        console.log('jesus puto4',this.accountId);
    }

}