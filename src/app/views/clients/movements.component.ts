import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';

@Component({
    selector: 'movements',
    templateUrl: 'movements.component.html'
})

export class MovementsComponent implements OnInit {

    @Input() clientId: any;
    @Input() accountId: any;

    public url: string;
    public columns: any[] = [];
    public filter: any = { };

    constructor() {
        
    }

    ngOnInit() {
        this.url = 'http://localhost:8080/movement/getMovemetDataTableByAccount?account_id=' + this.accountId;
        
        this.columns = [
            {
                title: 'ID',
                data: 'movement_id',
                name: 'movement_id',
                responsivePriority: 0
            },
            {
                title: 'Tipo Movimiento',
                data: 'movementType.description',
                name: 'movementType',
                responsivePriority: 1
            },
            {
                title: 'Tipo Operación',
                data: 'operationType.description',
                name: 'operationType',
                responsivePriority: 2
            },
            {
                title: 'Descripción',
                data: 'description',
                name: 'description',
                responsivePriority: 3
            },
            {
                title: 'Importe',
                data: 'amount',
                name: 'amount',
                responsivePriority: 4
            },
            {
                title: 'Fecha de Operación',
                data: 'operation_date',
                name: 'operation_date',
                responsivePriority: 3,
                render: function (data, tye, full, meta) {
                    let _date = new Date(data).toLocaleDateString();
                    return _date;
                }
            }
        ];
    }

}