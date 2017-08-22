import { Directive, ElementRef, HostListener, Input } from '@angular/core';

declare var $: JQueryStatic;

@Directive({
    selector: '[icheck]'
})

export class ICheckDirective {
    $: any = $;

    constructor(el: ElementRef) {
        this.$(el.nativeElement).iCheck({
            checkboxClass: 'icheckbox_square-aero',
            radioClass: 'iradio_square-aero'
        })
    }
}