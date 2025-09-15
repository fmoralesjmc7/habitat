import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'previsualizador-pdf',
  templateUrl: './previsualizador-pdf.component.html',
  styleUrls: ['./previsualizador-pdf.component.scss'],
})
export class PrevisualizadorPdfComponent {
  @Input() pdfBase64 = '';
  @Input() heightPdf = '';
  @Input() backgroundColor = '';
  @Output() pdfRedered: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    //requerido
  }

  onPageRendered(event) {
    if(event && event.pageNumber) {
      this.pdfRedered.emit(true);
    }
  }
}
