import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatoMayusculas'
})

export class FormatoCapitalize implements PipeTransform {

    public transform(input:string): string{
        if (input !== undefined && input !== null) {
            return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.slice(1).toLowerCase()));
        } else {
            return '';
        }
    }
    
}
