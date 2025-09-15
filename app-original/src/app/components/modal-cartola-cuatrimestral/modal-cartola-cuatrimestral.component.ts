/**
 * Componentes utilizado para mostrar modals con formato estandar
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { CONSTANTES_PLANES_STEP_1 } from 'src/app/pages/planes-de-ahorro/util/constantes.planes'; 

@Component({
    selector: 'app-modal-cuatrimetral',
    templateUrl: './modal-cartola-cuatrimestral.component.html',
    styleUrls: ['./modal-cartola-cuatrimestral.component.scss'],
})
export class ModalCartolaCuatrimestralComponent implements OnInit {

    @Input() public dataModal: HeaderElements;
    @Input() public tipoModal: HeaderElements;

    readonly CONSTANTES = CONSTANTES_PLANES_STEP_1;

    idTipoProducto: number;
    rutEmpleador: string;
    rut: number;
    dv: string;
    empleadoresUtilizados = [];

    @Output() public envioCerrarModal = new EventEmitter();

    constructor() {
        //requerido
    }

     ngOnInit() {
        //requerido

    }

    /**
     * Se envia aviso de cierre de modal a vista
     */
    public async cerrarModal() {
        this.envioCerrarModal.emit();
    }
}
