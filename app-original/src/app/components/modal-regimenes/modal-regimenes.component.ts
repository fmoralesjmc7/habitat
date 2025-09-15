/**
 * Componentes utilizado para mostrar modals para regimenes, se diferencia de los modals generales ya que
 * este recibe un arreglo de objetos y se visualiza con bullets
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-modal-regimenes',
    templateUrl: './modal-regimenes.component.html',
    styleUrls: ['./modal-regimenes.component.scss']
})
export class ModalRegimenesComponent implements OnInit {
    @Input() public objetoSlide: any[];
    @Input() public tipoCuenta: number;
    @Output() public envioCerrarModal = new EventEmitter();
    slidesRegimenes: any[];
    tipoCuentaNumber: number;

    /**
     * Recibimos arreglo como parametro y posteriormente es fomateado para mostrarse en vista, según el
     * tipo de cuenta se muestran sus regínemes asociados
     */
    ngOnInit() {
        this.slidesRegimenes = [];
        let regimenesArray = JSON.parse(JSON.stringify(this.objetoSlide));
        regimenesArray.forEach(reg => {
            this.slidesRegimenes.push(reg)
        });
        let tipoString = this.tipoCuenta + "";
        this.tipoCuentaNumber = parseInt(tipoString);
    }

    /**
     * Se envia aviso de cierre de modal a vista
     */
    public cerrarModal() {
        this.envioCerrarModal.emit();
    }
}
