import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { SecurityContext, ChangeDetectorRef } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

import { Ng2FileDropAcceptedFile } from 'ng2-file-drop';
import { Select2OptionData } from 'ng2-select2';

import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'detail-massive-charge',
    templateUrl: 'detail-massive-charge.component.html',
    styleUrls: ['image-validation.component.css']
})

export class DetailMassiveChargeComponent implements OnInit {

    private supportedFileTypes: string[] = ['text/plain'];

    private fileReader = new FileReader();
    private file: any[];
    private imageShown: boolean = false;
    private currentImage: string = 'assets/images/profile_small.jpeg';
    private fileName: string = '';

    public alerts: any[] = [];

    FileTypes: Array<Select2OptionData> = [];
    FileTypesOptions: Select2Options;
    FileType: any;

    Progress: boolean | number = false;

    constructor(private _http: HttpRequestService,
                private sanitizer: DomSanitizer) {
        this._http.progress$.subscribe(
            data => {
                console.log('progress = ' + data);
            }
        );

        this.alerts = this.alerts.map((alert: any) => ({
            type: alert.type,
            msg: this.sanitizer.sanitize(SecurityContext.HTML, alert.msg),
            timeout: 3000
        }));
    }

    ngOnInit() {
        this.getFileTypes();
    }

    private dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
        this.file = [];

        this.fileReader.onload = (event) => {
            this.currentImage = 'assets/images/flat-text-icon.png';
            this.imageShown = true;  
            this.fileName = acceptedFile.file.name;
            this.file.push(acceptedFile.file);
        };

        this.fileReader.readAsDataURL(acceptedFile.file);
    }

    private onRefresh() {
        this.fileReader.abort();
        this.currentImage = 'assets/images/profile_small.jpeg';
        this.imageShown = false;  
        this.fileName = '';
    }

    private post() {
        if (this.fileReader.result) {
            this._http.postFileWithCredentials('http://localhost:8080/massive-charge/postFile',
                    ['type_alias', this.FileType], this.file)
                .subscribe(
                    data => {
                        let res = JSON.parse(data);

                        setTimeout(() => {
                            if (res.statusCode == 200) {
                                this.alerts.push({
                                    type: 'success',
                                    msg:`<strong>Procesado!</strong> El archivo se ha enviado exitosamente.`,
                                    timeout: 6000
                                });
                            }
                            else {
                                this.alerts.push({
                                    type: 'danger',
                                    msg:`<strong>Error!</strong> Hubo un error en el servidor. Por favor, comuníquese con el Administrador del Sistema.`,
                                    timeout: 6000
                                });
                            }

                            setTimeout(() => {
                                this.onRefresh();
                            }, 500);
                        }, 750);                        

                        console.log(res);
                    },
                    error => console.log(error),
                    () => console.log('Request Finished')
                );
        }
    }

    getFileTypes() {
        this.FileTypesOptions = {
            dropdownAutoWidth: false,
            width: '100%',
            allowClear: false,
            placeholder: {
                id: -1,
                text: 'Tipo de Archivo'
            }
        };

        let url: string = 'http://localhost:8080/massive-charge/getAllFileTypes'
        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    let _data = JSON.parse(data._body);
                    let array: any[] = [];
                    
                    _data.forEach(obj => {
                        let _obj = {
                            id: obj.alias,
                            text: obj.description
                        };

                        array.push(_obj);
                    });

                    this.FileTypes = array;
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    onFileTypesChange(event: any) {
        this.FileType = event.value;
    }
    
    startLoading(): void {
        this.Progress = 0; 
 
        setTimeout(() => {
            this.Progress = 0.5; 
 
            setTimeout(() => {
                this.Progress = 1; 
 
                setTimeout(() => {
                    this.Progress = false; 
                }, 500);
            }, 500);
        }, 400);
    }
}