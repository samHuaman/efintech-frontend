import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataFilter'
})

export class DataFilterPipe implements PipeTransform {
    transform(array: any[], query: string): any {
        let result: any;
        let _array: any[] = [];

        if (query) {
            _.filter(array, row => {
                result = row.username.indexOf(query) > -1
                if (result) {
                    _array.push(row);
                }                
            });

            return _array;
        }

        return array;
    }
}