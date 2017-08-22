import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var jQuery:any;

@Component({
    selector: 'iboxindex',
    templateUrl: 'iboxtoolsindex.component.html'
})

export class IboxIndexComponent implements OnInit, AfterViewInit {

    ngOnInit() {
        let form_filter = jQuery('div.form-filter');
        form_filter.slideToggle(200);
    }

    ngAfterViewInit() {
        
    }

    public colapseFilter(e): void {
        e.preventDefault();

        let ibox = jQuery(e.target).closest('div.ibox');
        let button = jQuery(e.target).closest('i');
        let content = jQuery(e.target).closest('div.ibox');
        let form_filter = jQuery('div.form-filter');

        form_filter.slideToggle(200);
        button.toggleClass('fa-filter').toggleClass('fa-filter');
        ibox.toggleClass('').toggleClass('border-bottom');

        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    }
    
}