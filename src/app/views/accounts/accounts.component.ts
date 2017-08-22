import { Component, OnInit, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { Select2OptionData } from 'ng2-select2';
import { Input, Output} from '@angular/core';
import { URLSearchParams } from "@angular/http";

//componentes
import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'account',
    templateUrl: 'accounts.component.html'
})


export class AccountComponent implements OnInit {

    //DataTable
    @Input() clientId: any;

    public _accountsURL: string;
    public _accountColumns: any[] = [];
    public _accountSelected: any;

    ShowDropdown: boolean = false;

    //AccountDetail
    @Output() accountId: EventEmitter<string> = new EventEmitter()

    public alerts: any[] = [];
    public _accountDetailURL: string;
    public _accountId: number;
    public filter: any = { };

    _MyDatePickerModel: any;
    _MyDatePickerOptions: IMyDpOptions;
    _datePlaceholder: string = 'Fecha de Desembolso';

    _Products: Array<Select2OptionData> = [];
    _ProductsOptions: Select2Options;

    _SubProducts: Array<Select2OptionData> = [];
    _SubProductsOptions: Select2Options;

    _Currencys: Array<Select2OptionData> = [];
    _CurrencysOptions: Select2Options;
    
    _FullName:any;

    //Totales
    public _accountTotalURL: string;

    _accountTotal: any = {};
    _totalCoutas: number = 0;

    _data_account: boolean = false;
    _edit_data: boolean = false;

    _accounts: any;
    //_accountDetail: any;
    _accountDetail: any = {};
    _id: number;

    Schedule: any = { };
    PendingFees: any[] = [];

    total_fees: any = 0;
    sum_amount_insurance: any = 0.00;
    sum_amount_arrears: any = 0.00;
    sum_amount_compensatory: any = 0.00;

    constructor(private _router: Router,
        private _httpRequestService: HttpRequestService,
        private _route: ActivatedRoute) { }

    ngOnInit() {

        let _div = jQuery('div.account_data');
        _div.slideToggle(200);

        //AccountDataTableByClientId
        this._accountsURL = 'http://localhost:8080/account/getAccountDataTableByClientId?clientId=' + this.clientId;
        this._accountColumns = [
            {
                title: 'Nro. Cuenta',
                data: 'aaccount',
                name: 'aaccount',
                responsivePriority: 0
            },
            {
                title: 'Sub Producto',
                data: 'sub_product_id.description',
                name: 'sub_product_id',
                responsivePriority: 1
            },
            {
                title: 'Monto Desembolsado',
                data: 'amount_DISBURSED',
                name: 'amount_DISBURSED',
                responsivePriority: 2
            },
            {
                title: 'Saldo',
                data: 'amount',
                name: 'amount',
                responsivePriority: 3
            },
            {
                title: 'Tipo Moneda',
                data: 'currency_TYPE_ID.description',
                name: 'currency_TYPE_ID.description',
                responsivePriority: 4
            },
            {
                title: 'Nro. Cuotas',
                data: 'number_quotas',
                name: 'number_quotas',
                responsivePriority: 5
            }
        ];

        /**********************************************************/
        
       
        this.getAccountTotal();
        this.getProductsData();
        this.getSubProductsData();
        this.getCurrencyData();
    }

    public onShowDropdown(event: any) {
        if (event) {
            this._accountSelected = event;
            this._accountId = this._accountSelected.account_id;
            this.accountId.emit(this._accountId.toString());
            this.accountDetail(this._accountId);
            this.ShowDropdown = true;
            this.getLastSchedule();

            console.log(this._accountId);
        }
        else {
            this._accountSelected = null;
            this._accountId = null;            
            this.ShowDropdown = false;
            this.accountId.emit(null);
            this.Schedule = { };
            this.PendingFees = [];
            this.total_fees = 0;
            this.sum_amount_insurance = 0.00;
            this.sum_amount_arrears = 0.00;
            this.sum_amount_compensatory = 0.00;
        }
    }

    getLastSchedule() {
        let url = 'http://localhost:8080/schedule/getLastScheduleByAccount?account_id=' + this._accountId;
        this._httpRequestService.getWithCredentials(url)
            .subscribe(
                data => {
                    this.Schedule = data._body ? JSON.parse(data._body) : { };

                    this.total_fees = 0;
                    this.sum_amount_insurance = 0.00;
                    this.sum_amount_arrears = 0.00;
                    this.sum_amount_compensatory = 0.00;

                    if (data._body) {
                        this.getPendingFees();
                    }
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    getPendingFees() {
        let url = 'http://localhost:8080/schedule/getPendingFees?schedule_id=' + this.Schedule.schedule_id;
        this._httpRequestService.getWithCredentials(url)
            .subscribe(
                data => {
                    this.PendingFees = data._body ? JSON.parse(data._body) : { };
                    this.total_fees = this.PendingFees.length;
                    
                    this.PendingFees.forEach(fee => {
                        this.sum_amount_insurance += (fee.disgrace_insurance + fee.other_insurance);
                        this.sum_amount_arrears += fee.arrears_interest;
                        this.sum_amount_compensatory += fee.compensatory_interest;
                    });
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    //Trae detalle de la Cuenta
    accountDetail(_accountId) {
        this._accountDetailURL = 'http://localhost:8080/account/getAccountDetailByAccountId?accountId=' + _accountId;
        if (this._accountId > 0 && this._accountId != null) {
            this._httpRequestService.getWithCredentials(this._accountDetailURL)
                .subscribe(
                _data => {
                    this._accountDetail = JSON.parse(_data._body);
                    this._FullName = this._accountDetail.client_id.firstname + ' ' + this._accountDetail.client_id.secondname
                    + ' ' + this._accountDetail.client_id.lastname_a + ' ' + this._accountDetail.client_id.lastname_b;

                    let _date: Date = new Date();
                    this._MyDatePickerModel = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
                    this._MyDatePickerOptions = {
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
                    this._accountDetail.disbur_date = this._accountDetail.disbur_date != null ? {
                        date: {
                            year: new Date(this._accountDetail.disbur_date).toLocaleDateString().split('/')[2],
                            month: new Date(this._accountDetail.disbur_date).toLocaleDateString().split('/')[1],
                            day: new Date(this._accountDetail.disbur_date).toLocaleDateString().split('/')[0]
                        },
                        formatted: new Date(this._accountDetail.disbur_date).toLocaleDateString()
                    } : {
                            date: this._MyDatePickerModel,
                            formatted: ''
                        };
                }
                )
        }
    }

    //Edita/Graba detalle de cuenta
    accountDetailSave(){
        let _data = new URLSearchParams();

        _data.append('account_id',this._accountDetail.account_id);
        _data.append('aaccount',this._accountDetail.aaccount);
        _data.append('product_id.product_id',this._accountDetail.product_id.product_id);
        _data.append('sub_product_id.sub_product_id',this._accountDetail.sub_product_id.sub_product_id);
        _data.append('CURRENCY_TYPE_ID.currency_id',this._accountDetail.currency_TYPE_ID.currency_id);
        _data.append('disbur_date',this._accountDetail.disbur_date != null ? this._accountDetail.disbur_date.formatted || null:null);
        _data.append('payment_priority',this._accountDetail.payment_priority);
        _data.append('number_quotas',this._accountDetail.number_quotas);
        _data.append('amount_requested',this._accountDetail.amount_requested);
        _data.append('payday',this._accountDetail.payday);
        _data.append('total_length',this._accountDetail.total_length);
        _data.append('interest_rate_mora',this._accountDetail.interest_rate_mora);
        _data.append('an_effe_compe_inte_rate',this._accountDetail.an_effe_compe_inte_rate);
        _data.append('tota_compe_inte',this._accountDetail.tota_compe_inte);
        _data.append('comm_for_oper_expen',this._accountDetail.comm_for_oper_expen);
        _data.append('insurance',this._accountDetail.insurance);
        _data.append('total_debt',this._accountDetail.total_debt);
        

        this._httpRequestService.postWithCredentials('http://localhost:8080/account/editAccount', _data)
        .subscribe(
            _data => {
                let _res = JSON.parse(_data._body);
                setTimeout(() => {
                    this._edit_data = false;

                    if(_res.statusCode == 200){
                        this.alerts.push({
                            type: 'success',
                            msg:`<strong>Guardado!</strong> Los cambios se guardaron exitosamente.`,
                            timeout: 200
                        });
                    }
                    else if(_res.statusCode == 400){
                       this.alerts.push({
                            type: 'warning',
                            msg:`<strong>Alerta!</strong> Hubo un problema al intentar guardar los cambios. Por favor, inténtelo nuevamente.`,
                            timeout: 200
                        }); 
                    }
                    else{
                        this.alerts.push({
                            type: 'danger',
                            msg:`<strong>Error!</strong> Hubo un error en el servidor. Por favor, comuníquese con el Administrador del Sistema.`,
                            timeout: 200
                        });
                    }
                    this.accountDetail(this._accountSelected.account_id);
                },500);
                console.log(_res);
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

    onDateChanged(event: IMyDateModel) {
        this._accountDetail.disbur_date.formatted = event.formatted;
    }

    onProductsChange(event: any) {
        this._accountDetail.product_id = {
            product_id: event.value
        };
    }

    onSubProductsChange(event: any) {
        this._accountDetail.sub_product_id = {
            sub_product_id: event.value
        };
    }

    onCurrencyChange(event: any) {
        this._accountDetail.currency_TYPE_ID = {
            currency_id: event.value
        };
    }

    getProductsData() {
        this._ProductsOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Producto'
            }
        };

        let _productsURL = 'http://localhost:8080/account/getAllProducts';

        this._httpRequestService.getWithCredentials(_productsURL)
            .subscribe(
            _data => {
                let _products = JSON.parse(_data._body);
                let _productsArray: any[] = [];

                _products.forEach(obj => {
                    let _obj = {
                        id: obj.product_id,
                        text: obj.description
                    };

                    _productsArray.push(_obj);
                });
                this._Products = _productsArray;
            }
            );
    };

    getSubProductsData() {
        this._SubProductsOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Sub Producto'
            }
        };

        let _subproductsURL = 'http://localhost:8080/account/getAllSubProducts';

        this._httpRequestService.getWithCredentials(_subproductsURL)
            .subscribe(
            _data => {
                let _subProducts = JSON.parse(_data._body);
                let _subProductsArray: any[] = [];

                _subProducts.forEach(obj => {
                    let _obj = {
                        id: obj.sub_product_id,
                        text: obj.description
                    };

                    _subProductsArray.push(_obj);
                });
                this._SubProducts = _subProductsArray;
            }
            );
    };

    getCurrencyData(){
        this._CurrencysOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Moneda'
            }
        };

        let _currencysURL = 'http://localhost:8080/product/getAllCurrencies';

        this._httpRequestService.getWithCredentials(_currencysURL)
        .subscribe(
            _data => {
                let _currencys = JSON.parse(_data._body);
                let _currencysArray: any[] = [];

                _currencys.forEach(obj => {
                    let _obj = {
                        id: obj.currency_id,
                        text: obj.description
                    };
                    _currencysArray.push(_obj)
                });
                this._Currencys = _currencysArray;
            }
        );
    };

    getAccountTotal(){
         //Trae Totales
        this._accountTotalURL ='http://localhost:8080/account/getAllAccountByClientId?clientId=' + this.clientId;
        if(this.clientId > 0 && this.clientId != null){
            this._httpRequestService.getWithCredentials(this._accountTotalURL)
            .subscribe(
                _data => {
                    this._accountTotal = JSON.parse(_data._body);
                    let sumCuotas = 0;
                    this._accountTotal.forEach(e => {
                        sumCuotas += Number(e.number_quotas)
                    });
                    this._totalCoutas= sumCuotas;
                }
            )
        };
    }

    onShow() {
        if (!this._data_account) {
            let _div = jQuery('div.account_data');
            _div.slideToggle(200);
        }
    }

    onHide() {
        if (this._data_account) {
            let _div = jQuery('div.account_data');
            _div.slideToggle(200);
        }
    }
}