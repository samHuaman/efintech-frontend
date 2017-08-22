import { Component, ComponentRef, EventEmitter, ElementRef, ComponentFactory } from '@angular/core';
import { OnInit, OnDestroy, OnChanges, AfterViewInit, SimpleChange } from '@angular/core';
import { Input, Output, ViewChild, ViewContainerRef } from '@angular/core';

import { HttpRequestService } from '../../services/httprequest.service';
import { DropdownTemplateBuilder } from '../dynamic/template-dropdown.builder';
import { IHaveDynamicData, DynamicTypeBuilder } from '../dynamic/type.builder';

var $ = require( 'jquery' );
var dt = require( 'datatables.net' );
require( 'datatables.net-responsive' );

@Component({
    selector: 'mydatatables-ajax',
    templateUrl: 'datatables-ajax.component.html'
})

export class MyDataTablesAjaxComponent implements OnInit, OnChanges {

    private Table: any;
    private TableWidget: any;

    @Input() url: string;
    @Input() columns: any[];
    @Input() filter: any;

    @Output() dataSelected: EventEmitter<any> = new EventEmitter();
    @Output() key: EventEmitter<any> = new EventEmitter();
    
    private WasViewInitialized: boolean = false;

    constructor(private elementRef: ElementRef,
                private _http: HttpRequestService,
                protected templateBuilder: DropdownTemplateBuilder,
                protected typeBuilder: DynamicTypeBuilder) {
        
    }

    public ngOnInit() {
        setTimeout(()=> {
            this.loadData();
        }, 750);
    }

    public loadData(): void {
        if (this.TableWidget) {
            this.TableWidget.clear();
        }

        this.Table = $(this.elementRef.nativeElement.querySelector('table'));
        this.TableWidget = this.Table.DataTable({
            autoWidth: false,
            responsive: true,
            searching: false,
            ordering: false,
            processing: true,
            serverSide: true,
            stateSave: false,
            lengthChange: false,
            info: false,
            pageLength: 8, //<--
            ajax: {
                url: this.url,
                type: 'GET',
                data: (data) => {
                    let _filter = JSON.stringify(this.filter);
                    let _order = $.map(data.order, (item) => {
                        return {
                            Property: data.columns[item.column].name,
                            Direction: item.dir
                        };
                    });
                    
                    delete data.columns;
                    delete data.order;
                    delete data.search;

                    data.filter = _filter ? JSON.parse(_filter) : { };
                    data.orderBy = _order;
                }
            },
            columns: this.columns
        });

        $('#data_table tbody').on('click', 'tr', (ev) => {
            if ( $(ev.currentTarget).hasClass('selected') ) {
                $(ev.currentTarget).removeClass('selected');
                this.key.emit('');
            }
            else {
                this.TableWidget.$('tr.selected').removeClass('selected');

                $(ev.currentTarget).addClass('selected');

                let cell_data = this.TableWidget.row(ev.currentTarget).data();
                
                this.key.emit(cell_data);
            }
        });
    }

    public onReload() {
        if (this.TableWidget) {
            this.key.emit('');
            this.TableWidget.draw(false);
        }
    }
    
    public ngAfterViewInit(): void
    {
        this.WasViewInitialized = true; 
    }

    public ngOnChanges(changes: {[key: string]: SimpleChange}): void
    {        
        if (this.WasViewInitialized) {
            if (this.TableWidget) {
                this.TableWidget.draw();
            }

            return;
        }
    }
    
}