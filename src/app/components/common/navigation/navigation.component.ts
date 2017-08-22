import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Http, Headers, RequestOptions, Response } from "@angular/http"
import { Observable } from "rxjs"

import { HttpRequestService } from '../../../services/httprequest.service';

import 'jquery-slimscroll';
import 'rxjs/Rx';

declare var jQuery: any;

export class Option {
    id: number;
    option_type: number;
    parent: number;
    description: string;
    url: string;
    sequence: number;
    icon: string;
    list: string;
    level: number;

    children: any[] = [];
}

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements OnInit {

  Nombres: string = '';
  Username: string = '';

  getBody: any = {};
  photo = 'assets/images/profile_small.jpeg';
  imageUrl: any = 'assets/images/profile_small.jpeg';

  menuItems: Array<Option> = [];

  constructor(private router: Router, 
              private http: Http, 
              private _httpRequestService: HttpRequestService) {
  }

  ngAfterViewInit() {
      if (jQuery("body").hasClass('fixed-sidebar')) {
        jQuery('.sidebar-collapse').slimscroll({
          height: '100%'
        })
      }
  }

  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }

  async ngOnInit() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser != null) {
      this.getUserProfile();
      await this.getMenu();

      setTimeout(() => {
        jQuery('#side-menu').metisMenu();
        this.getUserImage();
      }, 2000);
    }
  }

  getUserProfile() {
    return this._httpRequestService.getWithCredentials('http://lh.com:8080/user/getProfile')
            .subscribe(
              data => {
                this.getBody = JSON.parse(data._body);

                this.Nombres = this.getBody.firstname + ' ' + ((this.getBody.lastname == null) ? '' : this.getBody.lastname);
                this.Username = this.getBody.username;
              },
              error => console.log(error),
              () => console.log('Request Finished')
            );
  }

  getUserImage() {
    this._httpRequestService.getImageWithCredentials('http://lh.com:8080/user/getImage?username=' + this.Username)
        .subscribe(
          data => {
            this.imageUrl = data;
          });
  }

  async getMenu() {
    return this._httpRequestService.getWithCredentials('http://lh.com:8080/navigation/getMenu')
            .subscribe(
              data => {
                let myArray: any[] = [];
                myArray = JSON.parse(data._body) as any[];

                myArray.forEach(element => {
                  let option: Option = {
                    id: element.option_id,
                    description: element.description,
                    icon: element.icon,
                    list: element.visible,
                    option_type: element.type_id,
                    parent: element.parent_id,
                    sequence: element.sequence,
                    url: element.url,
                    children: [],
                    level: 1
                  };
                  
                  this.menuItems.push(option);
                });
              },
              error => console.log(error),
              () => {
                console.log('Request Finished');
              }
            );
  }

}
