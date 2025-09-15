import { ChangeDetectorRef, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { CONSTANTES_TRAZAS_DATOS } from '../../../../../src/app/pages/actualizar-datos/util/datos.constantes';
import { ActualizarDatosService } from '../../../../../src/app/services/api/restful/actualizar-datos.service';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { ResizeClass } from '../../../../../src/app/util/resize.class';

@Injectable({
    providedIn: 'root'
})
/**
 * Clase con funciones comunes entre formularios de edicion
 */
export class CommonActualizarDatosClass extends ResizeClass {

    /**
     * Referencia al rut
     */
    rut: number;
    /**
     * Referencia al digito verificador.
     */
    dv: string;

    /**
     * Se asigna el uuid desde la pantalla anterior (actualizar datos)
     */
    uuid: string;

    /**
     * Listado combo ciudades
     */
    @Input() listadoCiudades = [];

    /**
     * Listado ciudades visibles según la región
     */
    @Input() listadoCiudadesVisibles: any[] = [];

    /**
     * Dirección seleccionada
     */
    @Input() direccionSeleccionada: any;

    /**
     * Listado comunas visibles según la ciudad.
     */
    @Input() listadoComunasVisibles: any[] = [];

    /**
     * Listado combo comunas
     */
    @Input() listadoComunas = [];

    /**
     * Volver a modo visualización. 
     */
    @Output() volverVisualizar: EventEmitter<void> = new EventEmitter();

    constructor(public readonly actualizarDatosService: ActualizarDatosService,
        public readonly contextoAPP: ContextoAPP,
        public readonly cdr: ChangeDetectorRef) {
        super(contextoAPP);
    }

    /**
     * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
     * @param codigoOperacion 
     */
    registrarTrazabilidad(codigoOperacion: number): void {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza: CONSTANTES_TRAZAS_DATOS,
            uuid: this.uuid,
            rut: this.rut,
            dv: this.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_EXITO.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_EXITO);
                break;
            case CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_ERROR.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_ERROR);
                break;
            case CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_LABORAL_EXITO.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_LABORAL_EXITO);
            break;
            case CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_LABORAL_ERROR.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_LABORAL_ERROR);
            break;
        }

        this.actualizarDatosService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }

    /**
     * Metodo encargado de seleccionar una región
     * 
     * @param regionSeleccionada a desplegar
     */
    cambioRegion(regionSeleccionada: number): void {

        this.direccionSeleccionada.id_comuna = -1;
        this.direccionSeleccionada.id_ciudad = -1;

        this.listadoCiudadesVisibles = this.listadoCiudades.filter((ciudad: any) => ciudad.id_region === regionSeleccionada);

        this.listadoComunasVisibles.length = 0;
        this.listadoComunasVisibles.push({ "id_comuna": -1, "nombre_comuna": "...", "codigo_comuna": -1, "id_region": -1 });

        this.cdr.detectChanges();
    }

    /**
     * Metodo encargado de cambiar ciudad
     * 
     * @param ciudadSeleccionada a desplegar
     */
    cambioCiudad(ciudadSeleccionada: number): void {
        if (ciudadSeleccionada) {
            this.direccionSeleccionada.id_comuna = -1;
            this.listadoComunasVisibles = this.listadoComunas.filter((comuna: any) => comuna.id_ciudad === ciudadSeleccionada.toString());
        }
    }

    /**
    * Encargado de mostrar alerta de confirmación cuando el usuario intenta cancelar.
    */
    cerrarEdicion(): void {
        this.volverVisualizar.emit();
    }
}
