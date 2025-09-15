/**
 * Componentes utilizado para mostrar modals con formato estandar
 */
import {ApplicationRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { UtilService,PlanesService } from 'src/app/services'; 
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { CONSTANTES_PLANES_STEP_1 } from 'src/app/pages/planes-de-ahorro/util/constantes.planes';
import {rutFormat, rutValidate} from "rut-helpers";
import { Keyboard } from '@capacitor/keyboard'; 

@Component({
    selector: 'app-modal-general',
    templateUrl: './modal-general.component.html',
    styleUrls: ['./modal-general.component.scss'],
})
export class ModalGeneralComponent implements OnInit {

    @Input() public dataModal: HeaderElements;
    @Input() public tipoModal: number;

    readonly CONSTANTES = CONSTANTES_PLANES_STEP_1;

    tituloModalInformativo: string;
    texto1ModalInformativo: string;
    texto2ModalInformativo: string;
    textoBoton: string;
    tipoDeModal: number; //1-Modal Informativo Step1 2-Modal Empleador 3-Modal Informativo Step2
    idTipoProducto: number;
    rutEmpleador: string;
    rut: number;
    dv: string;
    formatoRutCorrecto = false;
    empleadoresUtilizados = [];

    @Output() public envioCerrarModal = new EventEmitter();

    constructor(
        private utilService: UtilService,
        private planesService: PlanesService,
        private contextoAPP: ContextoAPP,
        private ref: ApplicationRef
    ) {
    }

    /**
     * Recibe parametros desde la vista en donde se mostrara el modal, con esto
     * se obtienen todos los textos que se deben ver y el tipo de modal para
     * determinar que boton mostrar
     */
     ngOnInit() {
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
        let textos = JSON.parse(JSON.stringify(this.dataModal));
        this.tituloModalInformativo = textos.titulo;
        this.texto1ModalInformativo = textos.texto1;
        this.texto2ModalInformativo = textos.texto2;
        this.textoBoton = textos.boton;
        this.empleadoresUtilizados = textos.empleadoresUtilizados;
        this.idTipoProducto = Number(textos.tipoProducto);
        this.tipoDeModal = Number(JSON.parse(JSON.stringify(this.tipoModal)));
    }


    /**
     * Validación de formato de rut valido
     */
    validarRut(desde) {
        this.rutEmpleador = rutFormat(this.rutEmpleador);
        this.ref.tick();
        if (!rutValidate(this.rutEmpleador)) {
            if(desde === 'blur'){
                this.utilService.mostrarToast('Debe ingresar un formato de RUT válido');
            }
            this.formatoRutCorrecto = false;
        }else{
            this.formatoRutCorrecto = true;
        }
    }

    /**
     * Validación de formato de rut valido para boton buscar
     * Si es modal empleador se debe validar el rut, en caso
     * contrario retorna true (puede adaptarse a un llamado
     * al modal desde otro lado)
     */
    validarBotonAceptar() {
        if(this.tipoDeModal === this.CONSTANTES.MODAL_EMPLEADOR){
            if( this.formatoRutCorrecto){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    }

    /**
     * Se envia aviso de cierre de modal a vista
     */
    public async cerrarModal(rutEmpleador) {
        if(rutEmpleador){ //En caso de modal rut empleador
            const loading = await this.contextoAPP.mostrarLoading();
            let rutSinDigito = rutEmpleador.split("-", 1);
            let toReplace =  /\./gi;
            rutSinDigito = rutSinDigito[0].replace(toReplace, "")
            if(String(rutSinDigito) === String(this.rut)){
                this.utilService.mostrarToast(this.CONSTANTES.TEXTO_RUT_IGUALES);
                this.contextoAPP.ocultarLoading(loading);
            }else{
                this.planesService.obtenerEmpleadoresPorRut(this.rut, this.dv, rutSinDigito).subscribe(async (respuestaEmpleador: any) => {
                    if(!respuestaEmpleador.id_mae_empleador){
                        this.utilService.mostrarToast(this.CONSTANTES.TEXTO_NO_EXISTE_EMPLEADOR);
                    }else{
                        let buscarEmpleador;
                        if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
                            buscarEmpleador = this.empleadoresUtilizados.find((empleadorEnPlan: any) => (respuestaEmpleador.rut_empleador === empleadorEnPlan.rut && empleadorEnPlan.cuenta === this.CONSTANTES.NOMBRE_CUENTA2));
                        }else{
                            buscarEmpleador = this.empleadoresUtilizados.find((empleadorEnPlan: any) => (respuestaEmpleador.rut_empleador === empleadorEnPlan.rut && empleadorEnPlan.cuenta === this.CONSTANTES.NOMBRE_APV));
                        }
                        if(buscarEmpleador){
                            if(buscarEmpleador.estado === this.CONSTANTES.ESTADO_ACTIVA){
                                this.utilService.mostrarToast(this.CONSTANTES.TEXTO_ERROR_RUT_USADO_ACTIVA);
                            }else {
                                this.utilService.mostrarToast(this.CONSTANTES.TEXTO_ERROR_RUT_USADO_EN_PROCESO);
                            }
                        }else{
                            this.envioCerrarModal.emit({empleador: respuestaEmpleador});
                        }
                    }
                    this.contextoAPP.ocultarLoading(loading);
                }, async (error) => {
                    this.utilService.mostrarToast(this.CONSTANTES.TEXTO_NO_EXISTE_EMPLEADOR);
                    this.contextoAPP.ocultarLoading(loading);
                });
            }
        }else{
            this.envioCerrarModal.emit();
        }
    }

    /**
     * Redireccion a link de creación de la cuenta que se halla seleccionado
     * @param cuenta
     */
    abrirPagina(cuenta: number) {
        let url;
        switch (cuenta) {
            case 2:
                url = this.CONSTANTES.URL_CUENTA2;
                break;
            case 4:
                url = this.CONSTANTES.URL_APV;
                break;
        }
        this.utilService.openWithSystemBrowser(url);
    }

    /**
     * Elimina caracteres que sobrepasen el limite permitido en un string
     * @param campo
     * @param desde
     * @param maximoCaracteres
     */
    limiteDeCaracteres(campo: any, maximoCaracteres: number) {
        if(campo){
            if ((campo.length) >= (maximoCaracteres)) {
                let array = Array.from(campo);
                let nuevaVariable = "";
                for (let x = 0; x < maximoCaracteres; x++) {
                    nuevaVariable = "" + nuevaVariable + array[x];
                }
                this.rutEmpleador = nuevaVariable;
            }
            this.validarRut('limiteDeCaracteres');
        }
    }

    /**
     * (Solo para modal empleadores plan de ahorro) Funcionalidad para boton enter de teclado, se cierra el
     * teclado y se se valida que el rut sea correcto
     */
    enterTeclado(){
        Keyboard.hide();
        this.validarRut('change');
    }

    /**
     * Se valida que los campos ingresados solo sean los permitidos
     * para un rut (numeros, puntos, guiones y letra K)
     * @param event
     */
    public onKeyUp(event: any) {
        let newValue = event.target.value;
        let regExp = new RegExp('^[kK\.0-9\-? ]+$');
        if (! regExp.test(newValue)) {
            event.target.value = newValue.slice(0, -1);
        }
    }
}
