import { Component, OnDestroy, OnInit } from '@angular/core';

import { FlotChartDirective } from '../../components/charts/flotChart';

import { HttpRequestService } from '../../services/httprequest.service';

declare var jQuery:any;

@Component({
    selector: 'roles',
    templateUrl: 'roles.component.html'
})

export class RolesComponent implements OnDestroy, OnInit {
    public data;
    public filterQuery = '';
    public rowsOnPage = 10;
    public sortBy = 'descripcion';
    public sortOrder = 'asc';

    public constructor(private _httpRequestService: HttpRequestService) {

    }

    public ngOnInit(): void {
        this._httpRequestService.getWithCredentials('http://lh.com:8080/security/roles/list')
            .subscribe((data) => {
                setTimeout(() => {
                    this.data = JSON.parse(data._body);
                    console.log('Request Finished');
                }, 1000);
            });
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    public ngOnDestroy(): any {

    }

}