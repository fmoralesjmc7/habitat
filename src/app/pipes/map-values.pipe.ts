// https://webcake.co/looping-over-maps-and-sets-in-angular-2s-ngfor/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'mapValues'})
export class MapValuesPipe implements PipeTransform {
  transform(map: Map<any, any> = new Map(), args?: any[]): Object[] {
    return Array.from(map.values());
  }
}
