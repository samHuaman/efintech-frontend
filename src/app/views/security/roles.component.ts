import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { FlotChartDirective } from '../../components/charts/flotChart';
import { HttpRequestService } from '../../services/httprequest.service';
import { Select2OptionData } from 'ng2-select2';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { URLSearchParams } from "@angular/http";

declare var jQuery:any;

@Component({
    selector: 'roles',
    templateUrl: 'roles.component.html'
})

export class RolesComponent implements OnDestroy, OnInit {

    SN_Create:boolean = true;
    public modalRef: BsModalRef;
    
    public filter: any = { };
    public url: string;
    public columns: any[];

    public urlR:string;
    role_detail: any = {};
    rolesDesc: any[];
    public alerts: any[] = [];


    public ShowDropdown: boolean = false;
    public SelectedRole: any = {};

    Roles: Array<Select2OptionData> = [];
    RolesOptions: Select2Options;
    UserRoles: any[];
    SelectedRoles: any[];

    constructor(private modalService: BsModalService,
    private _httpRequestService: HttpRequestService) {

    }

    public ngOnInit(): void {
        this.url = 'http://localhost:8080/role/getRoleDataTable';
        this.columns = [
            { 
                title: 'Id', 
                data: 'role_id'
            },
            { 
                title: 'Descripción', 
                data: 'description'
            },
            {
                title: 'Alias', 
                data: 'alias'
            }
        ];

        this.getRolesData();
    }

    public ngOnDestroy(): any {

    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public onShowDropdown(event: any) {
        if (event) {
            this.SelectedRole = event;
            this.ShowDropdown = true;
            this.getRoleData(this.SelectedRole.role_id);
        }
        else {
            this.SelectedRole = null;
            this.ShowDropdown = false;
        }
    }

    getRolesData() {
        this.RolesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            multiple: true,
            placeholder: {
                id: -1,
                text: 'Roles'
            },
            dropdownParent: jQuery('.modal-body')
        };

        let url: string = 'http://localhost:8080/role/getAllRoles'
        this._httpRequestService.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.role_id,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.Roles = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onChangeRoles(event: any) {
        if (event.value.length > 0) {
            this.SelectedRoles = event.value.map((_role: any) => ({
                role_id: _role
            }));
        }
        else {
            this.SelectedRoles = [];
        }
    }

    getRoleData(role_id:any){
        this.urlR = 'http://localhost:8080/role/getRoleData?role_id=' + role_id;
        if (role_id > 0 && role_id != null){
            this._httpRequestService.getWithCredentials(this.urlR)
            .subscribe(
                _data => {
                    this.role_detail = JSON.parse(_data._body);
                    this.rolesDesc = this.role_detail.role_id;
                }
            )
        }
    }

    getSaveRole(){
        let _data = new URLSearchParams();

        _data.append('role_id',this.role_detail.role_id);
        _data.append('description',this.role_detail.description);
        _data.append('alias',this.role_detail.alias);

        this._httpRequestService.postWithCredentials('http://localhost:8080/role/editRole',_data)
        .subscribe(
            _data => {
                let _res = JSON.parse(_data._body);
                setTimeout(() => {

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
                    //this.role_detail(this.SelectedRole.role_id);
                },500);
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

    getSaveRole2(){
        let _data = new URLSearchParams();

        _data.append('role_id',this.role_detail.role_id);
        _data.append('description',this.role_detail.description);
        _data.append('alias',this.role_detail.alias);


        this._httpRequestService.postWithCredentials('http://localhost:8080/role/saveRole',_data)
        .subscribe(
            _data => {
                let _res = JSON.parse(_data._body);
                setTimeout(() => {

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
                    //this.role_detail(this.SelectedRole.role_id);
                },500);
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