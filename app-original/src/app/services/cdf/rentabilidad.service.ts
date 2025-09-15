import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RentabilidadService {

    private continuarCDF = new Subject<any>();

    eventoContinuarCDF(data: any) {
        this.continuarCDF.next(data);
    }

    getObservable(): Subject<any> {
        return this.continuarCDF;
    }
}