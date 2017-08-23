import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Router } from '@angular/router';

import { PasswordValidation } from '../../helpers/password-validation';
import { HttpRequestService } from '../../services/httprequest.service';
import { LoginComponent } from '../appviews/login.component';

declare var jQuery:any;

@Component({
    selector: 'change',
    templateUrl: 'change.component.html',
    providers: [LoginComponent]
})

export class ChangePasswordComponent implements OnDestroy, OnInit {

    public barLabel: string = "Password strength:";

    changeForm: FormGroup;

    Username: string;
    OldPassword: string;
    NewPassword: string;    

    ResponsePost: string;

    constructor(formBuilder: FormBuilder,
                private _httpRequestService: HttpRequestService,
                private router: Router,
                private _login: LoginComponent) {
        let passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        this.changeForm = formBuilder.group({
            Username: [null, Validators.required],
            OldPassword: [null, Validators.required],
            NewPassword: [null, Validators.compose([Validators.required,
                                                    Validators.pattern(passRegex)])],
            ConfirmPassword: [null, Validators.required]
        },
        {
            validator: PasswordValidation.MatchPassword
        })
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    postChange() {
        let data = new URLSearchParams();
        data.append('username', this.Username);
        data.append('currentPassword', this.OldPassword);
        data.append('newPassword', this.NewPassword);

        let response: string;

        return this._httpRequestService.postWithCredentials('http://localhost:8080/user/changePassword', data)
                .subscribe(data => {
                    this.ResponsePost = data._body;

                    this._login.Username = this.Username;
                    this._login.Password = this.NewPassword;
                    this._login.postLogin();
                });
    }

}
