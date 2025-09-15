import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTES_PRUDENTIAL } from '../../../util/producto.constantes';

@Component({
  selector: 'app-modal-informativo-prudential',
  templateUrl: './modal-informativo-prudential.component.html',
  styleUrls: ['./modal-informativo-prudential.component.scss'],
  standalone: false,
})
export class ModalInformativoPrudentialComponent implements OnInit {
  @Input() ventanaOrigen!: string;
  @Output() cerrarModal: EventEmitter<void> = new EventEmitter();

  textoHeaderModal: string =
    CONSTANTES_PRUDENTIAL.MODAL_FELICITACIONES.TEXTO_SUSCRIPCION;

  ngOnInit(): void {
    if (
      this.ventanaOrigen === CONSTANTES_PRUDENTIAL.MODAL_FELICITACIONES.CODIGO
    ) {
      this.textoHeaderModal =
        CONSTANTES_PRUDENTIAL.MODAL_FELICITACIONES.TEXTO_RESUSCRIPCION;
    }
  }

  onCerrarModal(): void {
    this.cerrarModal.emit();
  }
}
