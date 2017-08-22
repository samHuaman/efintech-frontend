import { Component} from '@angular/core';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
    selector: 'clients',
    templateUrl: 'clients.component.html'    
})

export class ClientsComponent implements OnInit {

    public url: string;
    public columns: any[] = [];
    public filter: Object = { };

    ShowDropdown: boolean = false;
    public ClientSelected: any;

    ngOnInit() {
        this.url  = 'http://localhost:8080/client/getClientDataTable';
        this.columns = [
            {
                title: 'ID',
                data: 'client_id',
                name: 'client_id',
                responsivePriority: 0
            },
            {
                title: 'Tipo de Persona',
                data: 'personType.description',
                name: 'personType',
                responsivePriority: 1
            },
            {
                title: 'Tipo de Documento',
                data: 'documentType.description',
                name: 'documentType',
                responsivePriority: 2
            },
            {
                title: 'Número de Documento',
                data: 'document_number',
                name: 'document_number',
                responsivePriority: 3
            },
            {
                title: 'RUC',
                data: 'taxpayer_id_number',
                name: 'taxpayer_id_number',
                responsivePriority: 4
            },
            {
                title: 'Nombres',                
                name: 'names',
                render: function(data, type, full, meta) { 
                    return full.firstname + ' ' + full.secondname
                },
                responsivePriority: 5
            },
            {
                title: 'Apellidos',
                name: 'lastname',
                render: function(data, type, full, meta) { 
                    return full.lastname_a + ' ' + full.lastname_b
                },
                responsivePriority: 6
            }
        ];
    }
    
    public onShowDropdown(event: any) {
        if (event) {
            this.ClientSelected = event;
            this.ShowDropdown = true;
        }
        else {
            this.ClientSelected = null;
            this.ShowDropdown = false;
        }
    }

}