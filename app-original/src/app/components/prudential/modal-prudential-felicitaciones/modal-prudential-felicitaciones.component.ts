import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CONSTANTES_PRUDENTIAL } from 'src/app/util/producto.constantes';

@Component({
  selector: 'app-modal-prudential-felicitaciones',
  templateUrl: './modal-prudential-felicitaciones.component.html',
  styleUrls: ['./modal-prudential-felicitaciones.component.scss']
})
export class ModalPrudentialFelicitacionesComponent implements OnInit {
  @Input() ventanaOrigen: string;
  @Output() cerrarModal: EventEmitter<void> = new EventEmitter();

  textoHeaderModal: string = CONSTANTES_PRUDENTIAL.MODAL_FELICITACIONES.TEXTO_SUSCRIPCION;

  ngOnInit(): void {
    if (this.ventanaOrigen === CONSTANTES_PRUDENTIAL.MODAL_FELICITACIONES.CODIGO) {
      this.textoHeaderModal = CONSTANTES_PRUDENTIAL.MODAL_FELICITACIONES.TEXTO_RESUSCRIPCION;
    }
  }

  onCerrarModal(): void {
    this.cerrarModal.emit();
  }
}
