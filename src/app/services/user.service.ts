import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { URLSearchParams } from '@angular/http';

import { HttpRequestService } from './httprequest.service';

@Injectable()
export class UserService {
    constructor(private _httpRequestService: HttpRequestService) {

    }

    async disableUser(_data: URLSearchParams): Promise<string> {
        let response: string;

        await this._httpRequestService.postWithCredentials('http://localhost:8080/user/enableUsers', _data)
            .subscribe(
                data => {
                    response = data._body;
                },
                err => {
                    response = 'ERROR';
                },
                () => console.log('Request Finished')
            );
        
        return response;
    }
}