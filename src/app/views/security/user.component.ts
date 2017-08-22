import { Component, ViewContainerRef, OnInit, Input, Output } from '@angular/core';
import { ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Select2OptionData } from 'ng2-select2';

import { FlotChartDirective } from '../../components/charts/flotChart';

import { HttpRequestService } from '../../services/httprequest.service';
import { ModalComponent } from '../../components/common/modal/modal.component';
import { MyDropdownComponent } from '../../components/common/dropdown/dropdown.component';

declare var jQuery: any;

@Component({
    selector: 'users',
    templateUrl: 'user.component.html',
    providers: [ModalComponent, MyDropdownComponent]
})

export class UsersComponent implements OnInit {

    public filter: Object = { };
    public url: string;
    public columns: any[];

    public ShowDropdown: boolean = false;
    public UserSelected: string;

    constructor(private _httpRequestService: HttpRequestService,
                public toastr: ToastsManager, 
                vcr: ViewContainerRef,
                private el: ElementRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }
    
    ngOnInit() {       
        this.url = 'http://localhost:8080/user/getUserDataTable';
        this.columns = [
            { 
                title: 'Username', 
                data: 'username'
            },
            { 
                title: 'Email', 
                data: 'email'
            },
            { 
                title: 'Fullname', 
                render: function(data, type, full, meta) { 
                    return ''.concat(full.firstname, ' ', full.lastname != null ? full.lastname : ''); 
                } 
            }
        ];
    }
    
    ngAfterViewInit() {

    }

    public onShowDropdown(event: any) {
        if (event) {
            this.UserSelected = event;
            this.ShowDropdown = true;
        }
        else {
            this.UserSelected = null;
            this.ShowDropdown = false;
        }
    }

    public selectEnabled(enabled: string){
        
    }

    public toInt(num: string) {
        return +num;
    }

    onClean() {
        
    }

    ngOnDestroy() {

    }
}