import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from "@angular/http";
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { FlotChartDirective } from '../../components/charts/flotChart';

import { GlobalValidator } from '../../helpers/global-validators';
import { HttpRequestService } from '../../services/httprequest.service';
import { UserService } from '../../services/user.service';
import { ModalComponent } from '../../components/common/modal/modal.component';
import { EmailValidation } from '../../helpers/password-validation';

declare var jQuery:any;

export class User {
    UserId: string;
    Username: string;
    Firstname: string;
    Lastname: string;
    ExpireDate: any = { };
    Email: string;
    ConfirmEmail: string;
    Password: string;
    DaysEnabled: number;
    Enabled: boolean;
    Image: any;
}

@Component({
    selector: 'user-create',
    templateUrl: 'user-create.component.html',
    providers: [FormBuilder, ModalComponent]
})

export class UserCreateComponent implements OnInit {

    private sub: any;
    username: string;

    _user: User = new User();

    datePlaceholder: string = 'Expire Date';
    progress: boolean | number = false;

    ResponsePost: string;
    ResponseEnable: string;
    ResponseImage: string = '';

    createForm: FormGroup;

    date: Date = new Date();
    url: string = "assets/images/profile_small.jpeg";

    private myDatePickerOptions: IMyDpOptions = {
        dayLabels: {
            su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'
        },
        monthLabels: {
            1: 'Ene', 
            2: 'Feb', 
            3: 'Mar', 
            4: 'Abr', 
            5: 'May', 
            6: 'Jun', 
            7: 'Jul', 
            8: 'Ago', 
            9: 'Sep', 
            10: 'Oct', 
            11: 'Nov', 
            12: 'Dic' 
        },
        todayBtnTxt: 'Hoy',
        editableDateField: false,
        openSelectorOnInputClick: true,
        dateFormat: 'dd/mm/yyyy'
    };

    constructor(private _httpRequestService: HttpRequestService,
                private router: Router,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private _userService: UserService) {
       this._httpRequestService.progress$.subscribe(
           data => {
               console.log('progress = ' + data);
           }
       );
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.username = params['username'];

            if (this.username != null || this.username != '') {
                this._httpRequestService.getWithCredentials('http://localhost:8080/user/getUserByName?username=' + this.username)
                    .subscribe(
                        data => {
                            let _data: any = data._body ? JSON.parse(data._body) : { };

                            this._user = {
                                UserId: _data.user_id,
                                Username: _data.username,
                                Enabled: _data.enabled ? true : false,
                                ExpireDate: _data.user_expired_date != null ? { 
                                    date: 
                                    { 
                                        year: new Date(_data.user_expired_date).toLocaleDateString().split('/')[2],
                                        month: new Date(_data.user_expired_date).toLocaleDateString().split('/')[1],
                                        day: new Date(_data.user_expired_date).toLocaleDateString().split('/')[0]
                                    },
                                    formatted: new Date(_data.user_expired_date).toLocaleDateString()
                                } : null,
                                Email: _data.email,
                                Firstname: _data.firstname,
                                Lastname: _data.lastname,
                                DaysEnabled: _data.days_enabled,
                                ConfirmEmail: null,
                                Password: null,
                                Image: ''
                            };

                            if (this._user.Username) {
                                this.url = 'http://localhost:8080/user/getImage?username=' + this._user.Username;
                            }
                        }
                    )
            }
        });

        console.log(this.isCreate());

        this.createForm = this.formBuilder.group({
            'Username': [null, Validators.required],
            'Firstname': [null, Validators.required],
            'Lastname': [null, null],
            'ExpireDate': [null, null],
            'Email': [null, Validators.compose([Validators.required, Validators.email])],
            'ConfirmEmail': [null, this.isCreate() ? Validators.compose([Validators.required, Validators.email]) : null],
            'DaysEnabled': [null, Validators.required],
            'Password': [null, this.isCreate() ? Validators.required : null],
            'Enabled': [null, null]
        },
        {
            validator: this.isCreate() ? EmailValidation.MatchEmail : null
        });
    }

    onDateChanged(event: IMyDateModel) {
        this._user.ExpireDate.formatted = event.formatted;

        console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(),
                     ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    }

    isCreate(): boolean {
        if (this.username == null || this.username == 'null') {
            return true;
        }
        else {
            return false;
        }
    }

    postCreate() {
        if (this.createForm.valid == true) {
            let data = new URLSearchParams();
            let email_confirmed: string = '0';

            if (this._user.Email == this._user.ConfirmEmail) {
                email_confirmed = '1';
            }

            data.append('user_id', this._user.UserId || null)
            data.append('username', this._user.Username);
            data.append('p_password', this._user.Password);
            data.append('user_expired_date', this._user.ExpireDate != null ? this._user.ExpireDate.formatted : null);
            data.append('email', this._user.Email);
            data.append('email_confirmed', email_confirmed);
            data.append('firstname', this._user.Firstname);
            data.append('lastname', this._user.Lastname);
            data.append('days_enabled', this._user.DaysEnabled.toString());
            data.append('enabled', this._user.Enabled ? '1' : '0');


            this._httpRequestService.postWithCredentials('http://localhost:8080/user/saveUser', data)
                .subscribe(
                _data => {
                    console.log(_data._body);
                    this.ResponsePost = _data._body;
                    
                    setTimeout(() => {
                        this.router.navigate(['/seguridad/user']);
                    }, 1600);
                },
                error => {
                    this.ResponsePost = 'ERROR';
                });
        }
    }   

    changeUserStatus(comment: string, selectedValue: number) {
        let _data = new URLSearchParams();

        if (comment != null && comment.length > 0){
            _data.append('username', this._user.Username),
            _data.append('value', selectedValue.toString())
            _data.append('comment', comment);
        
            this._httpRequestService.postWithCredentials('http://localhost:8080/user/enableUsers', _data)
                .subscribe(
                    data => {
                        this.ResponseEnable = data._body;
                    },
                    err => {
                        this.ResponseEnable = 'ERROR';
                    },
                    () => console.log('Request Finished')
                );

            this._user.Enabled = selectedValue == 1 ? true : false;
        }
        else {
            this.ResponseEnable = 'WARNING';
        }
    }

    generatePassword() {
        var d = new Date();
        this._user.Password = 'AUTO' + d.getFullYear() + d.getMilliseconds() + Math.random().toString().slice(-8);
    }

    readUrl(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            var _event: any = { };

            reader.onload = (event) => {
                _event = event.target;
            }

            reader.readAsDataURL(event.target.files[0]);

            var files = event.srcElement.files;
            console.log(files);
            this._httpRequestService.postFileWithCredentials('http://localhost:8080/user/saveImage', 
                ['username', this._user.Username], files)
                    .subscribe(() => {
                        this.url = _event.result;
                        this.ResponseImage = '';
                        console.log('sent');
                    },
                    err => {
                        this.ResponseImage = err;
                    });
        }
    }

    startLoading(): void {
        this.progress = 0; // starts spinner
 
        setTimeout(() => {
            this.progress = 0.5; // sets progress bar to 50%
 
            setTimeout(() => {
                this.progress = 1; // sets progress bar to 100%
 
                setTimeout(() => {
                    this.progress = false; // stops spinner
                }, 500);
            }, 500);
        }, 400);
    }

}