import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../services/httprequest.service';
import { MyDropdownComponent } from '../../components/common/dropdown/dropdown.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Input } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { URLSearchParams } from "@angular/http";

// export class Warranty {
//     customer_type:any;
//     customer:any;
//     amount_assessed:any;
// }

@Component({
    selector: 'warranty',
    templateUrl: 'warrantys.component.html',
    providers: [MyDropdownComponent]
})

export class WarrantyComponent implements OnInit {

    //DataTable
    @Input() clientId: any;
    @Input() accountId: any;
    public _warrantyURL: string;
    public _warrantyCoulumns: any[] = [];
    public _warrantySelected: any;
    ShowDropdown: boolean = false;

    //Warranty Detal
    public _warrantyId: number;
    public _warrantyDetailURL: string;
    _warrantyDetail: any = {};
    public alerts: any[] = [];

    //Client
    _warrantyClientURL: string;
    _warrantyClient: any = {};
    _fullName: any;

    //Totales
    public _warrantyTotalURL: string;
    _warrantyTotal: any = {};
    _montoTotal: number = 0;
    _monto:number = 0;

    //Mostrar/Ocultar
    _data_warranty: boolean = false;
    _edit_data: boolean = false;

    //Traer WarrantyType
    _warrantysTypes : Array<Select2OptionData> = [];
    _warrantysTypesOptions: Select2Options;

    //Trae AssestType
    _assestsTypes: Array<Select2OptionData> = [];
    _assestsTypesOptions: Select2Options;






    warranty: any;
    id: number;
    //_warranty : Warranty = new Warranty();
    _warranty: any = {};
    //campos para input
    _amount_assessed: number = 0;
    _customer_type: string = '';
    _customer: string = '';
    public data_table_warranty: boolean = false

    constructor(private router: Router,
        private route: ActivatedRoute,
        private _httpRequestService: HttpRequestService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private el: ElementRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }



    ngOnInit() {

        //WarrantyDataTableByClientId
        this._warrantyURL = 'http://localhost:8080/warranty/getWarrantyDataTableByClientId?clientId=' + this.accountId;
        this._warrantyCoulumns = [
            {
                title: 'ID',
                data: 'warranty_id',
                name: 'warranty_id',
                responsivePriority: 1
            },            
            {
                title: 'Tipo de Activo',
                data: 'assest_type_id',
                name: 'assest_type_id',
                render: function(data, type, full, meta) { 
                    return data ? data.ddescription : '-';
                },
                responsivePriority: 2
            }, 
            {
                title: 'Descripción',
                data: 'ddescription',
                name: 'ddescription',
                responsivePriority: 3
            },
            {
                title: 'Valor Comercial ($)',
                data: 'commercial_value_dollar',
                name: 'commercial_value_dollar',
                responsivePriority: 4
            },
            {
                title: 'Valor Tasación Inicial ($)',
                data: 'rating_init_dollar',
                name: 'rating_init_dollar',
                responsivePriority: 5
            },
            {
                title: 'Valor Degravamen ($)',
                data: 'assessment_dollar',
                name: 'assessment_dollar',
                responsivePriority: 6
            },
            {
                title: 'Nro. Registro Público',
                data: 'public_record_number',
                name: 'public_record_number',
                responsivePriority: 7
            },
            {
                title: 'Monto Trasado',
                data: 'amount_assessed',
                name: 'amount_assessed',
                responsivePriority: 8
            }
        ]

        //Datos del cliente
        this._warrantyClientURL = 'http://localhost:8080/client/getClientContactInfo?client_id=' + this.clientId;
        if (this.clientId > 0 && this.clientId != null) {
            this._httpRequestService.getWithCredentials(this._warrantyClientURL)
                .subscribe(
                _data => {
                    this._warrantyClient = _data.body ? JSON.parse(_data._body): { };
                    this._fullName = this._warrantyClient.client ? this._warrantyClient.client.firstname + ' ' + this._warrantyClient.client.secondname + ' ' + this._warrantyClient.client.lastname_a + ' ' + this._warrantyClient.client.lastname_b : ' ';
                }
                )
        }

        //Monto total
        this._warrantyTotalURL = 'http://localhost:8080/warranty/getAllWarrantyById?customerId=' + this.accountId;
        if (this.clientId > 0 && this.clientId != null) {
            this._httpRequestService.getWithCredentials(this._warrantyTotalURL)
                .subscribe(
                _data => {
                    this._warrantyTotal = _data.body ?  JSON.parse(_data._body) : [];
                    let sumTotal = 0;
                    this._warrantyTotal.forEach(e => {
                        sumTotal += Number(e.amount_assessed);
                    });
                    this._montoTotal = sumTotal;
                }
                )
        }

        this.getWarrantyType();
        this.getAssestType();
    }

    public onShowDropdown(event: any) {
        if (event) {
            this._warrantySelected = event;
            this._warrantyId = this._warrantySelected.warranty_id;
            this.warrantyDetail(this._warrantyId);
            this.ShowDropdown = true;
        }
        else {
            this._warrantySelected = null;
            this._warrantyId = null;
            this.ShowDropdown = false;
        }
    }

    //trae detalle de la garantia
    warrantyDetail(_warrantyId) {
        this._warrantyDetailURL = 'http://localhost:8080/warranty/getWarrantyDetailById?warrantyId=' + _warrantyId;
        if (this._warrantyId > 0 && this._warrantyId != null) {
            this._httpRequestService.getWithCredentials(this._warrantyDetailURL)
                .subscribe(
                _data => {
                    this._warrantyDetail = _data.body ?  JSON.parse(_data._body) : { };
                    this._monto = this._warrantyDetail.amount_assessed;
                }
                )
        }
    }

    getWarrantyType(){
        this._warrantysTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Garantía'
            }
        };

        let _warrantyTypeURL = 'http://localhost:8080/warranty/getAllWarrantyType';
        this._httpRequestService.getWithCredentials(_warrantyTypeURL)
        .subscribe(
            _data => {
                let _warrantystypes = _data.body ?  JSON.parse(_data._body) : [];
                let _warrantysTypesArray: any[] = [];

                _warrantystypes.forEach(e => {
                        let _obj = {
                            id: e.warranty_type_id,
                            text: e.ddescription
                        };
                        _warrantysTypesArray.push(_obj);
                });
                this._warrantysTypes = _warrantysTypesArray;
            }
        );
    }
    onWarrantyTypeChange(event: any){
        this._warrantyDetail.warranty_type_id = {
            warranty_type_id: event.value
        };
    }
    getAssestType(){
        this._assestsTypesOptions = {
            dropdownAutoWidth: false,
            width:'100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo Activo'
            }
        };

        let _assestsTypeURL = 'http://localhost:8080/warranty/getAllAssestType';
        this._httpRequestService.getWithCredentials(_assestsTypeURL)
        .subscribe(
            _data => {
                let _assestsTypes = _data.body ?  JSON.parse(_data._body) : [];
                let _assestsTypesArray:any [] = [];

                _assestsTypes.forEach(element => {
                    let _obj = {
                        id: element.assest_type_id,
                        text: element.ddescription
                    };
                    _assestsTypesArray.push(_obj);
                });
                this._assestsTypes = _assestsTypesArray;
            }
        )
    }
    onAssestsTypeChange(event: any){
        this._warrantyDetail.assest_type_id = {
            assest_type_id: event.value
        }
    }

    warrantyDetailSave(){
        //console.log(this._warrantyDetail.warranty_type.warranty_type_id);
        let _data = new URLSearchParams();
        console.log('jesus puto',_data);

        _data.append('warranty_id',this._warrantyDetail.warranty_id);
        // _data.append('warranty_type_id.warranty_type_id',this._warrantyDetail.warranty_type_id.warranty_type_id);
        // _data.append('assest_type_id.assest_type_id',this._warrantyDetail.assest_type_id.assest_type_id);
        _data.append('ddescription',this._warrantyDetail.ddescription);
        _data.append('aaddress',this._warrantyDetail.aaddress);
        _data.append('public_record_number',this._warrantyDetail.public_record_number);
        _data.append('amount_assessed',this._warrantyDetail.amount_assessed);

        this._httpRequestService.postWithCredentials('http://localhost:8080/warranty/editWarranty', _data)
        .subscribe(
            _data => {
                let _res = _data.body ?  JSON.parse(_data._body) : { };
                setTimeout(() => {
                    this._edit_data = false;

                    if(_res.statusCode == 200){
                        this.alerts.push({
                            type:'success',
                            msg:`<strong>Guardado!</strong> Los cambios se guardaron exitosamente.`,
                            timeout:200
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
                    
                },500);
            },
            error => {
                this.alerts.push({
                    type: 'danger',
                    msg:`<strong>Error!</strong> Hubo un error en el servidor. Por favor, comuníquese con el Administrador del Sistema.`,
                    timeout: 200
                });
                console.log(error);
            },
            () => console.log('Request Finished')
        );

    }



    public function: string = 'visible(){console.log("holaMundo");}';
}