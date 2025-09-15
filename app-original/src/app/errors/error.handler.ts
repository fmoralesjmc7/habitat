import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HabitatErrorHandler extends ErrorHandler {

  constructor() {
    super();
  }

  handleError(error: any): void {
    // implementar lo que se necesite para el manejo del error
  }
}