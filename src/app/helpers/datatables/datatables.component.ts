import { Component, ComponentRef, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OnChanges, SimpleChange, ComponentFactory, ViewContainerRef } from '@angular/core';

import { HttpRequestService } from '../../services/httprequest.service';
import { DropdownTemplateBuilder } from '../../helpers/dynamic/template-dropdown.builder';
import { IHaveDynamicData, DynamicTypeBuilder } from '../../helpers/dynamic/type.builder';

var $ = require('jquery');
var dt = require( 'datatables.net' );

@Component({
    selector: 'mydatatables',
    templateUrl: './datatables.component.html'
    /*styleUrls: ['../../../../node_modules/datatables.net-dt/css/jquery.dataTables.css']*/
})

export class MyDataTablesComponent implements OnInit {
    private dataTable: any;
    private tableWidget: any;

    @Input() data: any[];
    @Input() columns: any[];
    @Input() dOptions: any[];
    @Input() dynamicComponentTarget: ViewContainerRef;

    @Output() dataSelected: EventEmitter<any> = new EventEmitter();
    @Output() key: EventEmitter<any> = new EventEmitter();

    protected componentRef: ComponentRef<IHaveDynamicData>;
    protected wasViewInitialized = false;

    constructor(private el: ElementRef,
                private _httpService: HttpRequestService,
                protected templateBuilder: DropdownTemplateBuilder,
                protected typeBuilder: DynamicTypeBuilder) {        
    }

    public ngOnInit() {
        setTimeout(() => {
            this.loadData();
        }, 1500);        
    }

    public loadData(): void {
        if (this.tableWidget) {
            // this.tableWidget.destroy();
            this.tableWidget.clear().rows.add(this.data).draw();
        }

        this.dataTable = $(this.el.nativeElement.querySelector('table'));
        this.tableWidget = this.dataTable.DataTable({
            responsive: true,
            data: this.data,
            dom: 'Bfrtip',
            select: true,
            columns: this.columns,
            pageLength: 8,
            buttons: [
                {
                    text: 'Select all',
                    action: function () {
                        this.dataTable.rows().select();
                    }
                },
                {
                    text: 'Select none',
                    action: function () {
                        this.dataTable.rows().deselect();
                    }
                }
            ],
            processing: true
        });

        $('#data_table tbody').on('click', 'tr', (ev) => {
            if ( $(ev.currentTarget).hasClass('selected') ) {
                $(ev.currentTarget).removeClass('selected');
                /* this.dynamicComponentTarget.clear(); */
                this.key.emit('');
            }
            else {
                /* this.dynamicComponentTarget.clear(); */
                this.tableWidget.$('tr.selected').removeClass('selected');

                $(ev.currentTarget).addClass('selected');

                let cell_data = this.tableWidget.row(ev.currentTarget).data();
                
                this.key.emit(cell_data);
                
                /* this.dOptions.forEach(element => {
                    element.param = cell_data;
                }); */

                /* let template = this.templateBuilder.prepareTemplate(this.dOptions);

                this.typeBuilder.createComponentFactory(template)
                    .then((factory: ComponentFactory<IHaveDynamicData>) => {
                        this.componentRef = this
                            .dynamicComponentTarget
                            .createComponent(factory);

                        let component = this.componentRef.instance;
                        component.entity = this.dOptions;
                    }); */
            }
        });
    }

    // this is the best moment where to start to process dynamic stuff
    public ngAfterViewInit(): void
    {
        this.wasViewInitialized = true; 
        /* this.loadData(); */
    }
    // wasViewInitialized is an IMPORTANT switch 
    // when this component would have its own changing @Input()
    // - then we have to wait till view is intialized - first OnChange is too soon
    public ngOnChanges(changes: {[key: string]: SimpleChange}): void
    {
        if (this.wasViewInitialized) {
            return;
        }
        /* this.loadData(); */
    }
    
    public ngOnDestroy(){
      if (this.componentRef) {
          /* this.componentRef.destroy(); */
          /* this.componentRef = null; */
      }
    }

}