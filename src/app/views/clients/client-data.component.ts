import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { Input } from '@angular/core';
import { SecurityContext  } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from "@angular/http";
import { Router } from '@angular/router';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/delay';

import { HttpRequestService } from '../../services/httprequest.service';

require('switchery/dist/switchery.css');

@Component({
    selector: 'client-data',
    templateUrl: 'client-data.component.html'
})

export class ClientDataComponent implements OnInit {

    @Input() clientId: any;

    Switchery = require('switchery/dist/switchery');

    Client: any = { };
    ClientAddress: any = { };
    ClientContactInfo: any = { };

    SN_Edit_Basic_Data: boolean = false;
    SN_Edit_Address_Data: boolean = false;
    SN_Edit_Contact_Info: boolean = false;

    AddressTypes: Array<Select2OptionData> = [];
    AddressStartValue: string;
    AddressTypesOptions: Select2Options;
    AddressTypesPlaceholder: IdTextPair;

    HousingTypes: Array<Select2OptionData> = [];
    HousingTypesOptions: Select2Options;

    ZoneTypes: Array<Select2OptionData> = [];
    ZoneTypesOptions: Select2Options;

    RoadTypes: Array<Select2OptionData> = [];
    RoadTypesOptions: Select2Options;

    GroupTypes: Array<Select2OptionData> = [];
    GroupTypesOptions: Select2Options;

    SectorTypes: Array<Select2OptionData> = [];
    SectorTypesOptions: Select2Options;

    Ubigeos: Array<Select2OptionData> = [];
    UbigeosOptions: Select2Options;
    UbigeosAjaxOptions: Select2AjaxOptions;

    PersonTypes: Array<Select2OptionData> = [];
    PersonTypesOptions: Select2Options;

    DocumentTypes: Array<Select2OptionData> = [];
    DocumentTypesOptions: Select2Options;

    Magnitudes: Array<Select2OptionData> = [];
    MagnitudesOptions: Select2Options;

    EconomicActivities: Array<Select2OptionData> = [];
    EconomicActivitiesOptions: Select2Options;

    Genders: Array<Select2OptionData> = [];
    GenderOptions: Select2Options;

    CountriesAjax: Select2AjaxOptions;
    NationalitiesOptions: Select2Options;
    ResidenceCountriesOptions: Select2Options;

    CivilStatus: Array<Select2OptionData> = [];
    CivilStatusOptions: Select2Options;

    EmploymentSituations: Array<Select2OptionData> = [];
    EmploymentSituationsOptions: Select2Options;

    EditBasicDataForm: FormGroup;
    EditContactForm: FormGroup;
    EditAddressForm: FormGroup;

    Progress: boolean | number = false;

    MaxYear: number;
    MyDatePickerOptions: IMyDpOptions;
    MyDatePickerModel: any = {};

    public alerts: any[] = [];

    constructor(private _http: HttpRequestService,
                private formBuilder: FormBuilder,
                private sanitizer: DomSanitizer,
                private router: Router) {
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
        this.EditBasicDataForm = this.formBuilder.group({
        //  'PersonType': [null, Validators.required],
        //  'DocumentType': [null, Validators.required],
            'DocumentNumber': [null, Validators.compose([Validators.required, Validators.minLength(8)])],
        //  'Magnitud': [null, null],
            'TIN': [null, Validators.compose([Validators.minLength(11), Validators.pattern('[0-9]+')])],
        //  'EconomicActivity': [null, null],
            'BusinessName': [null, null],
            'Firstname': [null, Validators.required],
            'Secondname': [null, null],
            'LastnameA': [null, null],
            'LastnameB': [null, null],
            'MarriedSurname': [null, null],
        //  'Gender': [null, null],
            'Birthdate': [null, null]
        //  'NaTionality': [null, null],
        //  'ResidenceCountry': [null, null],
        //  'CivilStatus': [null, null],
        //  'EmploymentSituation': [null, null],
        //  'Act': [null, null]
        });

        this.EditContactForm = this.formBuilder.group({
            'Email': [null, Validators.compose([Validators.required, Validators.email])],
            'Homephone': [null, null],
            'Cellphone': [null, null]
        });

        this.EditAddressForm = this.formBuilder.group({
            'ZoneName': [null, null],
            'Block': [null, null],
            'Lot': [null, null],
            'RoadName': [null, null],
            'RoadNumber': [null, null],
            'GroupName': [null, null],
            'GroupNumber': [null, null],
            'SectorName': [null, null],
            'Reference': [null, Validators.maxLength(100)]
        });
    
        let _date: Date = new Date();
        _date.setFullYear(_date.getFullYear() - 18);

        this.MyDatePickerModel = { year: _date.getFullYear(), month: 1, day: 1 };

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
            dateFormat: 'dd/mm/yyyy',
            maxYear: _date.getFullYear(),
            disableSince: {
                day: _date.getDate() + 1,
                month: _date.getMonth() + 1,
                year: _date.getFullYear()
            }
        };

        this.getClientData();

        this.getClientContactInfoData();

        let addressTypeUrl = 'http://localhost:8080/client/getAllAddressType';

        this._http.getWithCredentials(addressTypeUrl)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let addresType = {
                            id: obj.type_id,
                            text: obj.description
                        };

                        array.push(addresType);
                    });

                    this.AddressTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );

        this.AddressStartValue = '1';

        this.AddressTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: this.AddressTypesPlaceholder = {
                id: -1,
                text: 'Tipo de Domicilio'
            }
        };

        this.getHousingTypesData();

        this.getZoneTypesData();

        this.getRoadTypesData();

        this.getGroupTypesData();

        this.getSectorTypesData();

        this.UbigeosAjaxOptions = {
            url: 'http://localhost:8080/client/searchUbigeos',
            dataType: 'json',
            delay: 500,
            cache: true,
            data: (term, page, context) => {
                return {
                    str: term.term,
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
                        id: obj.ubigeo_id,
                        text: obj.ubigeo_code + ' - ' + obj.department + ', ' + obj.province + ', ' + obj.district
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
        }

        this.UbigeosOptions = {
            width: '100%',
            dropdownAutoWidth: false,
            minimumInputLength: 3,
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Ubigeo'
            },
            ajax: this.UbigeosAjaxOptions
        };

        /* this.getUbigeosData(); */

        this.getPersonTypesData();

        this.getDocumentTypesData();

        this.getMagnitudesData();

        this.getEconomicActivitiesData();

        this.getGendersData();

        this.getCountriesData();

        this.getCivilStatusData();

        this.getEmploymentSituationsData();

        //  let elements = document.querySelectorAll('.js-switch');

        /* for (var i = 0; i < elements.length; i++) {
            var swtch = new this.Switchery(elements[i], { color: '#41b7f1' });
        } */
    }

    postBasicData() {
        if (this.EditBasicDataForm.valid == true) {
            let data = new URLSearchParams();
            
            data.append('client_id', this.Client.client_id);
            data.append('personType.type_id', this.Client.personType.type_id);
            data.append('documentType.type_id', this.Client.documentType.type_id);
            data.append('document_number', this.Client.document_number);
            data.append('magnitude.magnitude_id', this.Client.magnitude.magnitude_id);
            data.append('taxpayer_id_number', this.Client.taxpayer_id_number);
            data.append('economicActivity.activity_id', this.Client.economicActivity.activity_id);
            data.append('business_name', this.Client.business_name);
            data.append('firstname', this.Client.firstname);
            data.append('secondname', this.Client.secondname);
            data.append('lastname_a', this.Client.lastname_a);
            data.append('lastname_b', this.Client.lastname_b);
            data.append('married_surname', this.Client.married_surname);
            data.append('gender.gender_id', this.Client.gender != null ? this.Client.gender.gender_id : null);
            data.append('birthdate', this.Client.birthdate != null ? this.Client.birthdate.formatted || null : null);
            data.append('nationality.country_id', this.Client.nationality != null ? this.Client.nationality.country_id : null);
            data.append('residence_country.country_id', this.Client.residence_country != null ? this.Client.residence_country.country_id : null);
            data.append('civilStatus.status_id', this.Client.civilStatus != null ? this.Client.civilStatus.status_id : null);
            data.append('employmentSituation.situation_id', this.Client.employmentSituation != null ? this.Client.employmentSituation.situation_id : null);
            data.append('data_protection_act', this.Client.data_protection_act == true ? '1' : '0');

            this._http.postWithCredentials('http://localhost:8080/client/editClient', data)
                .subscribe(
                    _data => {
                        let res = JSON.parse(_data._body);
                        
                        setTimeout(() => {
                            this.SN_Edit_Basic_Data = false;

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

                            this.getClientData();
                        }, 1500);

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

    postContactData() {
        if (this.EditContactForm.valid == true) {
            let data = new URLSearchParams();

            data.append('contact_information_id', this.ClientContactInfo.contact_information_id);
            data.append('client.client_id', this.ClientContactInfo.client.client_id);
            data.append('email', this.ClientContactInfo.email);
            data.append('home_phone', this.ClientContactInfo.home_phone);
            data.append('cellphone', this.ClientContactInfo.cellphone);

            this._http.postWithCredentials('http://localhost:8080/client/editContactInfo', data)
                .subscribe(
                    _data => {
                        let res = JSON.parse(_data._body);

                        setTimeout(() => {
                            this.SN_Edit_Contact_Info = false;
                            
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

                            this.getClientContactInfoData();
                        }, 1500);

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

    postAddressData() {
        if (this.EditAddressForm.valid) {
            let data = new URLSearchParams();

            data.append('address_id', this.ClientAddress.address_id);
            data.append('client.client_id', this.ClientAddress.client != null ? this.ClientAddress.client.client_id : this.Client.client_id);
            data.append('addressType.type_id', this.ClientAddress.addressType.type_id);
            data.append('housingType.type_id', this.ClientAddress.housingType != null ? this.ClientAddress.housingType.type_id : null);
            data.append('zoneType.type_id', this.ClientAddress.zoneType != null ? this.ClientAddress.zoneType.type_id : null);
            data.append('zone_name', this.ClientAddress.zone_name);
            data.append('block', this.ClientAddress.block);
            data.append('lot', this.ClientAddress.lot);
            data.append('roadType.type_id', this.ClientAddress.roadType != null ? this.ClientAddress.roadType.type_id : null);
            data.append('road_name', this.ClientAddress.road_name);
            data.append('road_number', this.ClientAddress.road_number);
            data.append('groupType.group_type_id', this.ClientAddress.groupType != null ? this.ClientAddress.groupType.group_type_id : null);
            data.append('group_name', this.ClientAddress.group_name);
            data.append('group_number', this.ClientAddress.group_number);
            data.append('sectorType.type_id', this.ClientAddress.sectorType != null ? this.ClientAddress.sectorType.type_id : null);
            data.append('sector_name', this.ClientAddress.sector_name);
            data.append('reference', this.ClientAddress.reference);
            data.append('ubigeo.ubigeo_id', this.ClientAddress.ubigeo != null ? this.ClientAddress.ubigeo.ubigeo_id : null);

            this._http.postWithCredentials('http://localhost:8080/client/editAddress', data)
                .subscribe(
                    _data => {
                        let res = JSON.parse(_data._body);

                        setTimeout(() => {
                            this.SN_Edit_Address_Data = false;
                            
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

                            this.onAddressTypeChange({ value: this.ClientAddress.addressType.type_id });
                        }, 1500);   

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

    onActChange(event: any) {
        if (event.target.checked) {
            this.Client.data_protection_act = '1';
        }
        else {
            this.Client.data_protection_act = '0';
        }
    }

    getClientData() {
        let clientUrl = 'http://localhost:8080/client/findById?id=' + this.clientId;

        this._http.getWithCredentials(clientUrl)
            .subscribe(
                data => {
                    if (data._body == '' || data._body == undefined) {
                        this.router.navigate(['/clientes']);
                    }

                    this.Client = JSON.parse(data._body);
                    this.Client.birthdate = this.Client.birthdate != null ? 
                    {
                        date: {
                            year: new Date(this.Client.birthdate).toLocaleDateString().split('/')[2],
                            month: new Date(this.Client.birthdate).toLocaleDateString().split('/')[1],
                            day: new Date(this.Client.birthdate).toLocaleDateString().split('/')[0]
                        },
                        formatted: new Date(this.Client.birthdate).toLocaleDateString()
                    } : 
                    {
                        date: this.MyDatePickerModel,
                        formatted: ''
                    };
                    this.Client.data_protection_act = this.Client.data_protection_act == 1 ? true : false;

                    if (this.Client.nationality != null) {
                        this.NationalitiesOptions.data = [{
                            id: this.Client.nationality.country_id,
                            text: this.Client.nationality.description
                        }];
                    }

                    if (this.Client.residence_country != null) {
                        this.ResidenceCountriesOptions.data = [{
                            id: this.Client.residence_country.country_id,
                            text: this.Client.residence_country.description
                        }];
                    }
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    getPersonTypesData() {
        this.PersonTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Tipo de Persona'
            }
        };

        let url = 'http://localhost:8080/client/getAllPersonTypes';

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

                    this.PersonTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onPersonTypesChange(event: any) {
        this.Client.personType = {
            type_id: event.value
        };

        console.log(this.EditBasicDataForm);
    }

    getDocumentTypesData() {
        this.DocumentTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Tipo de Documento'
            }
        };

        let url = 'http://localhost:8080/client/getAllDocumentTypes';

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

                    this.DocumentTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onDocumentTypesChange(event: any) {
        this.Client.documentType = {
            type_id: event.value
        };
    }

    getMagnitudesData() {
        this.MagnitudesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Magnitud'
            }
        };

        let url = 'http://localhost:8080/client/getAllMagnitudes';

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.magnitude_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.Magnitudes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onMagnitudesChange(event: any) {
        this.Client.magnitude = {
            magnitude_id: event.value
        };
    }

    getEconomicActivitiesData() {
        this.EconomicActivitiesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Actividad Económica'
            }
        };

        let url = 'http://localhost:8080/client/getAllActivities';

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.activity_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.EconomicActivities = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onActivitiesChange(event: any) {
        this.Client.economicActivity = {
            activity_id: event.value
        };
    }

    getGendersData() {
        this.GenderOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Sexo'
            }
        };

        let url = 'http://localhost:8080/client/getAllGenders';

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.gender_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.Genders = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onGendersChange(event: any) {
        this.Client.gender = {
            gender_id: event.value
        };
    }

    getCountriesData() {
        let url = 'http://localhost:8080/client/searchCountries';

        this.CountriesAjax = {
            url: url,
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
                        id: obj.country_id,
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
        }

        this.NationalitiesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            minimumInputLength: 3,
            placeholder: {
                id: -1,
                text: 'Nacionalidad'
            },
            ajax: this.CountriesAjax
        };

        this.ResidenceCountriesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            minimumInputLength: 3,
            placeholder: {
                id: -1,
                text: 'País de Residencia'
            },
            ajax: this.CountriesAjax
        };
    }

    onNationalitiesChange(event: any) {
        this.Client.nationality = {
            country_id: event.value
        };
    }

    onResidenceCountriesChange(event: any) {
        this.Client.residence_country = {
            country_id: event.value
        };
    }

    getCivilStatusData() {
        this.CivilStatusOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Estado Civil'
            }
        };

        let url = 'http://localhost:8080/client/getAllCivilStatus';

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.status_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.CivilStatus = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onCivilStatusChange(event: any) {
        this.Client.civilStatus = {
            status_id: event.value
        };
    }

    getEmploymentSituationsData() {
        this.EmploymentSituationsOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Situación Laboral'
            }
        };
        
        let url = 'http://localhost:8080/client/getAllSituations';

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.situation_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.EmploymentSituations = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onEmploymentSituationsChange(event: any) {
        this.Client.employmentSituation = {
            situation_id: event.value
        };
    }

    getClientContactInfoData() {
        let contactUrl = 'http://localhost:8080/client/getClientContactInfo?client_id=' + this.clientId;

        this._http.getWithCredentials(contactUrl)
            .subscribe(
                data => {
                    this.ClientContactInfo = data._body != '' ? JSON.parse(data._body) : {
                        client: {
                            client_id: this.Client.client_id
                        }
                     };
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onAddressTypeChange(event: any): void {
        if (event.value == null || event.value == undefined || event.value == '') {
            return;
        }

        let url = 'http://localhost:8080/client/getClientAddress?client_id=' + 
                            this.clientId.toString() + '&type_id=' + event.value;

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    this.ClientAddress = data._body != '' ? JSON.parse(data._body) : { };
                    this.ClientAddress.addressType = {
                        type_id: event.value
                    };

                    if (this.ClientAddress.ubigeo != null) {
                        let text = 
                            this.ClientAddress.ubigeo.ubigeo_code + ' - ' +
                            this.ClientAddress.ubigeo.department + ', ' +
                            this.ClientAddress.ubigeo.province + ', ' +
                            this.ClientAddress.ubigeo.district;

                        this.ClientAddress.strUbigeo = text;

                        this.UbigeosOptions.data = [
                            {
                                id: this.ClientAddress.ubigeo.ubigeo_id,
                                text: text
                            }
                        ];
                    }
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    enbaleEditAddress() {
        this.SN_Edit_Address_Data = true;
    }

    onBirthdateChanged(event: IMyDateModel) {
        this.Client.birthdate.formatted = event.formatted;
    }

    getHousingTypesData() {
        this.HousingTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Vivienda'
            }
        };

        let url = 'http://localhost:8080/client/getAllHousingTypes';

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

                    this.HousingTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onHousingTypeChange(event: any) {
        this.ClientAddress.housingType = {
            type_id: event.value
        };
    }

    getZoneTypesData() {
        this.ZoneTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Zona'
            }
        };

        let url = 'http://localhost:8080/client/getAllZoneTypes';

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

                    this.ZoneTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onZoneTypeChange(event: any): void {
        this.ClientAddress.zoneType = {
            type_id: event.value
        };
    }

    getRoadTypesData() {
        this.RoadTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Vía'
            }
        };

        let url = 'http://localhost:8080/client/getAllRoadTypes';

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

                    this.RoadTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }
    
    onRoadTypeChange(event: any): void {
        this.ClientAddress.roadType = {
            type_id: event.value
        };
    }

    getGroupTypesData() {
        this.GroupTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Grupo'
            }
        };

        let url = 'http://localhost:8080/client/getAllGroupTypes';

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

                    this.GroupTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onGroupTypeChange(event: any): void {
        this.ClientAddress.groupType = {
            group_type_id: event.value
        };
    }

    getSectorTypesData() {
        this.SectorTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: true,
            placeholder: {
                id: -1,
                text: 'Tipo de Sector'
            }
        };

        let url = 'http://localhost:8080/client/getAllSectorTypes';

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

                    this.SectorTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onSectorTypeChange(event: any): void {
        this.ClientAddress.sectorType = {
            type_id: event.value
        };
    }

    getUbigeosData() {
        let url = 'http://localhost:8080/client/getAllUbigeos';

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.ubigeo_id,
                            text: obj.department + ', ' + obj.province + ', ' + obj.district
                        };

                        array.push(_obj);
                    });

                    this.Ubigeos = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onUbigeoChange(event: any) {
        this.ClientAddress.ubigeo = {
            ubigeo_id: event.value
        };
    }

    startLoading(): void {
        this.Progress = 0; // starts spinner
 
        setTimeout(() => {
            this.Progress = 0.5; // sets progress bar to 50%
 
            setTimeout(() => {
                this.Progress = 1; // sets progress bar to 100%
 
                setTimeout(() => {
                    this.Progress = false; // stops spinner
                }, 500);
            }, 500);
        }, 400);
    }

}