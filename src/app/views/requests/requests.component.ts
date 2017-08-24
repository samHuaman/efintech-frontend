import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

 @Component({
     selector: 'requests',
    templateUrl: 'requests.component.html'
 })

export class RequestsComponent implements OnInit {

    public url: string;
    public columns: any[];
    public filter: Object;

    ShowDropdown: boolean = false;

    SelectedRequest: any = {};

    constructor() {

    }

    ngOnInit() {
        this.url = 'http://localhost:8080/requests/getRequestDataTable';
        this.columns = [
            {
                title: 'ID',
                data: 'request_id',
                name: 'request_id',
                responsivePriority: 0
            },
            {
                title: 'Tipo de Proceso',
                data: 'processType.description',
                name: 'processType',
                responsivePriority: 3
            },
            {
                title: 'Tipo de Archivo',
                data: 'fileType.description',
                name: 'fileType',
                responsivePriority: 4
            },
            {
                title: 'Fecha y Hora Inicio',
                data: 'start_date',
                name: 'start_date',
                responsivePriority: 6,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    let _time = new Date(data).toLocaleTimeString();
                    return _date + ' ' + _time;
                }
            },
            {
                title: 'Fecha y Hora Fin',
                data: 'end_date',
                name: 'end_date',
                responsivePriority: 7,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    let _time = new Date(data).toLocaleTimeString();
                    return _date + ' ' + _time;
                }
            },
            {
                title: 'Usuario',
                data: 'user.username',
                name: 'user',
                responsivePriority: 5
            },
            {
                title: 'Fase',
                data: 'requestPhase.description',
                name: 'requestPhase',
                responsivePriority: 1
            },
            {
                title: 'Estado',
                data: 'requestStatus',
                name: 'requestStatus',
                responsivePriority: 2,
                render: function (data, tye, full, meta) {
                    return data ? data.description : '-';
                }
            }
        ];
    }

    onShowDropdown(event: any) {
        if (event) {
            this.SelectedRequest = event;
            this.ShowDropdown = true;
        }
        else {
            this.SelectedRequest = { };
            this.ShowDropdown = false;
        }
    }
}