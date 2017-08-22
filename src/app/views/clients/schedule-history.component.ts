import { Component } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { Input } from '@angular/core';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { HttpRequestService } from '../../services/httprequest.service';

@Component({
    selector: 'schedule-history',
    templateUrl: 'schedule-history.component.html'
})

export class ScheduleHistoryComponent implements OnInit, OnChanges {

    @Input() accountId: any;

    MyDatePickerOptions: IMyDpOptions;
    MyDatePickerModel: any = { };

    public url: string;
    public columns: any[] = [];
    public filter: any;

    public Schedule: any = { };
    public FeeSelected: any;

    constructor(private _http: HttpRequestService) {

    }

    ngOnInit() {
        this.MyDatePickerOptions  = {
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

        this.getOriginalSchedule();
    }

    ngOnChanges() {

    }

    getOriginalSchedule() {
        let url: string = 'http://localhost:8080/schedule/getOriginalScheduleByAccount?account_id=' + this.accountId;
        this._http.getWithCredentials(url)
            .subscribe(
                data => {
                    this.Schedule = data._body ? JSON.parse(data._body) : { };

                    let param = this.Schedule.schedule_id ? this.Schedule.schedule_id : '0';

                    this.url = 'http://localhost:8080/schedule/getFeeDataTable?schedule_id=' + param;
                    this.columns = [
                        {
                            title: 'Nro. Cuota',
                            data: 'fee_number',
                            name: 'fee_number',
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

    onDateChanged(event: IMyDateModel) {
        this.filter = { scheduleRegistrationDate: event.formatted };
    }

}