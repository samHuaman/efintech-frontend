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

     constructor(private _httpRequestService: HttpRequestService){

     }

    ngOnInit(){

        console.log('jesus puto3',this.accountId);
        this.accountId = 1;
        this._accountStatusURL = 'http://localhost:8080/accountStatus/getAccountStatusDataTableByAccountId?accountId=' + this.accountId;
        this._accountStatusCoulumns = [
            {
                title: 'Fecha Operación',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 1
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
                }
                )
        }

        this.quotaId=1;
        this._quotaURL = 'http://localhost:8080/accountStatus/getQuotasDataTableByQuotaId?quotaId=' + this.quotaId;
        this._quotaColumns = [
            {
                title: 'Nro. Cuota',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 1
            },
            {
                title: 'Fec. Vencimiento',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 2
            },
            {
                title: 'Capital',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 3
            },
            {
                title: 'Interes compensatorio',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 4
            },
            {
                title: 'Interes moratorio',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 5
            },
            {
                title: 'Total de cuota',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 6
            },
            {
                title: 'Seguro Desgravamen',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 7
            },
            {
                title: 'Otros seguros',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 8
            },
            {
                title: 'Total a Pagar',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 9
            }
        ]
    }

    ngOnChanges(){
        console.log('jesus puto4',this.accountId);
    }

}