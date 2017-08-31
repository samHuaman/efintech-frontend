import { Component, TemplateRef } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { SecurityContext  } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';

import { HttpRequestService } from '../../services/httprequest.service';

require('datatables.net')

@Component({
    selector: 'schedule',
    templateUrl: 'schedule.component.html'
})

export class ScheduleComponent implements OnInit, OnChanges {

    @Input() accountId: any;

    public modalRef: BsModalRef;

    public url: string;
    public columns: any[] = [];
    public filter: Object = { };

    public Schedule: any = { };
    public FeeSelected: any;

    constructor(private _http: HttpRequestService,
                private modalService: BsModalService) {

    }

    ngOnInit() {
        this.getSchedule();
    }

    ngOnChanges() {

    }

    getSchedule() {
        let url: string = 'http://localhost:8080/schedule/getLastScheduleByAccount?account_id=' + this.accountId;

        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    this.Schedule = data._body ? JSON.parse(data._body) : { };

                    let param = this.Schedule.schedule_id ? this.Schedule.schedule_id : 0;

                    this.url = 'http://localhost:8080/schedule/getFeeDataTable?schedule_id=' + param ;
                    this.columns = [
                        {
                            title: 'Nro. Cuota',
                            data: 'sequence',
                            name: 'sequence',
                            responsivePriority: 0
                        },
                        {
                            title: 'Fec. Venc.',
                            data: 'expiration_date',
                            name: 'expiration_date',
                            responsivePriority: 1,
                            render: function (data, tye, full, meta) {
                                let _date = new Date(data).toLocaleDateString();
                                return _date;
                            }
                        },
                        {
                            title: 'Capital',
                            data: 'capital',
                            name: 'capital',
                            responsivePriority: 2
                            /* render: $.fn.DataTable().render. */
                        },
                        {
                            title: 'Int. Compensatorio',
                            data: 'compensatory_interest',
                            name: 'compensatory_interest',
                            responsivePriority: 3
                        },
                        {
                            title: 'Int. Moratorio',
                            data: 'arrears_interest',
                            name: 'arrears_interest',
                            responsivePriority: 4
                        },
                        {
                            title: 'Portes', 
                            data: 'monthly_commissions',            
                            name: 'monthly_commissions',
                            responsivePriority: 5
                        },
                        {
                            title: 'Total Cuota', 
                            data: 'total_fee',            
                            name: 'total_fee',
                            responsivePriority: 6
                        },
                        {
                            title: 'Seg. Desgravamen', 
                            data: 'disgrace_insurance',            
                            name: 'disgrace_insurance',
                            responsivePriority: 7
                        },
                        {
                            title: 'Otros Seguros', 
                            data: 'other_insurance',            
                            name: 'other_insurance',
                            responsivePriority: 8
                        },
                        {
                            title: 'Total Pagar', 
                            data: 'total_pay',            
                            name: 'total_pay',
                            responsivePriority: 9
                        },
                        {
                            title: 'Estado', 
                            data: 'feeStatus.description',            
                            name: 'feeStatus',
                            responsivePriority: 10
                        }
                    ];
                },
                error => console.log(error),
                () => console.log('Request Finished')
            );
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {
            class: 'modal-lg'
        });
    }

}
