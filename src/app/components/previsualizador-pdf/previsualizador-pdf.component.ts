import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-previsualizador-pdf',
  templateUrl: './previsualizador-pdf.component.html',
  styleUrls: ['./previsualizador-pdf.component.scss'],
  standalone: false
})
export class PrevisualizadorPdfComponent {
  @Input() pdfBase64 = '';
  @Input() heightPdf = '';
  @Input() backgroundColor = '';
  @Output() pdfRedered: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    //requerido
  }

  onPageRendered(event: any) {
    // TODO: Quitar cuando sepa el tipo
    console.log('EVENT TYPEOF:::', typeof event, event);

    if(event && event.pageNumber) {
      this.pdfRedered.emit(true);
    }
  }
}
