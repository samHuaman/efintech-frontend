import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { HttpRequestService } from './httprequest.service';
import { Option } from '../components/common/navigation/navigation.component';

@Injectable()
export class MenuService {
    constructor(private _httpRequestService: HttpRequestService) {

    }

    getMenu(): Array<Option> {
        let menuItems: Array<Option> = [];

         this._httpRequestService.getWithCredentials('http://lh.com:8080/user/getMenu.json')
            .subscribe(
              data => {
                let myArray: any[] = [];
                myArray = JSON.parse(data._body) as any[];

                myArray.forEach(element => {
                  let option: Option = {
                    id: element.id,
                    description: element.descripcion,
                    icon: element.icon,
                    list: element.listar,
                    option_type: element.id_tipo,
                    parent: element.id_padre,
                    sequence: element.secuencia,
                    url: element.url,
                    children: [],
                    level: 1
                  };

                  menuItems.push(option);
                });
              },
              error => console.log(error),
              () => console.log('Request Finished')
            );
        return menuItems;
  }
}