import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { smoothlyMenu } from '../../../app.helpers';

import { HttpRequestService } from '../../../services/httprequest.service';

declare var jQuery:any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {

  constructor(private router: Router, private _httpRequestService: HttpRequestService) { }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  logout() {
    console.log('Logout...........................');
    return this._httpRequestService.get('http://lh.com:8080/logout')
            .subscribe(
              data => {
                console.log(data._body);
                
                localStorage.removeItem('currentUser');
                this.router.navigate(['/login']);
              },
              error => console.log(error)
            );
  }

}
