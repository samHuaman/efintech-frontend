import { Component, ViewContainerRef, EventEmitter } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Input, Output } from '@angular/core';

import { URLSearchParams } from '@angular/http';

import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'enable-users',
    templateUrl: 'enable-disable-users.component.html'
})


export class EnableDisableUsersComponent implements OnInit, OnChanges {

    resetResult: string;
    comment: string;
    selectedValue: number;
     
    @Input() enabled: any;
    @Input() username: string;

    @Output() changed: EventEmitter<any> = new EventEmitter();
    
    actions: any[] = [
       {valor: 1, name: "Habilitar"},
       {valor: 0, name: "Deshabilitar"}
     ];

    constructor(private _httpRequestService: HttpRequestService) {

    }

    ngOnInit() {
        this.selectedValue = +this.enabled == 1 ? 0 : 1;
    }

    ngOnChanges() {
        this.selectedValue = +this.enabled == 1 ? 0 : 1;
        this.comment = '';
        this.resetResult = '';
    }

    onSubmit() {
        let _user = new URLSearchParams();

        if (this.comment != null && this.comment.length > 0){
            _user.append('username', this.username);
            _user.append('value', this.selectedValue.toString());
            _user.append('comment', this.comment);
        
            this._httpRequestService.postWithCredentials('http://localhost:8080/user/enableUsers', _user)
                .subscribe(
                    data => {
                        this.resetResult = data._body;
                        this.changed.emit(this.resetResult);
                    },
                    err => {
                        this.resetResult = 'ERROR';
                    },
                    () => console.log('Request Finished')
                );
        }
        else {
            this.resetResult = 'WARNING';
        }
    }        
} 