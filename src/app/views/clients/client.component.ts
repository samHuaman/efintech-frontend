import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'client',
    templateUrl: 'client.component.html'    
})

export class ClientComponent implements OnInit {

    public clientId: number;
    public accountId: string = null;
    private sub: any;

    public Tabs: number;

    constructor(private _http: HttpRequestService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        
    }

    ngOnInit() {
        this.Tabs = 1;
        
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.clientId = +params['id'];
        })
    }

    onSelectTab(num: number) {
        this.Tabs = num;
    }

    onAccountIdChange(event: any) {
        this.accountId = event;
    }
    
}