import { Component, OnInit } from '@angular/core';
import { ContextoAPP } from '../../util/contexto-app';
import { DatePipe } from "@angular/common";
import { UtilService } from '../../services';
import { NavController } from "@ionic/angular";
import { CONSTANTES_LIQUIDACION } from './util/constantes.liquidacion';
import { AppComponent } from "../../app.component";
import { CONSTANTES_ERROR_GENERICO } from '../../util/error-generico.constantes';
import { LiquidacionesService } from '../../services/api/restful/liquidaciones/liquidaciones.service';
import { NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-liquidacion-de-pensiones',
    templateUrl: './liquidacion-de-pensiones.component.html',
    styleUrls: ['./liquidacion-de-pensiones.component.scss'],
})
export class LiquidacionDePensionesComponent implements OnInit {

    //Variable para constantes
    readonly CONSTANTES_LIQUIDACION = CONSTANTES_LIQUIDACION;
    // Referencia al rut
    rut: number;
    // Referencia al digito verificador.
    dv: string;
    //Referencia al email
    email: string;
    //Muestral los campso de fehca
    showFormDate = false;
    //Muestra error para periodos 6-12 meses
    mostrarNoDisponible = false;
    //Muestra error para periodos 24 meses
    mostrarNoDisponible24 = false;
    //Variable fecha Desde input
    fechaDesde: string;
    //Variable fecha Hasta input
    fechaHasta: string;
    //Fecha minima seleccionada
    fechaMinimaCalculada: string;
    //Fecha máxima seleccionada
    fechaMaximaCalculada: any;
    //Muestra fecha hasta
    habilitaFechaHasta = true;
    //Valor por defecto de periodo
    tipoPerOptions: any = {
        header: this.CONSTANTES_LIQUIDACION.ELEGIR_PERIODO
    };
    //Objeto base para tipos
    tipoPeriodo: any = {tipo: null, desde: '', hasta: ''};
    //Arreglo con tipos de periodo
    listaTipoPeriodo: any[] = [
        {tipo: this.CONSTANTES_LIQUIDACION.ULTIMOS_6_MESES, desde: '', hasta: ''},
        {tipo: this.CONSTANTES_LIQUIDACION.ULTIMOS_12_MESES, desde: '', hasta: ''},
        {tipo: this.CONSTANTES_LIQUIDACION.ULTIMOS_24_MESES, desde: '', hasta: ''},
        {tipo: this.CONSTANTES_LIQUIDACION.RANGO_FECHAS_ABIERTO, desde: '', hasta: ''} // maximo 3 años
    ];
    //Label para input fecha desde
    labelDesde: any = this.CONSTANTES_LIQUIDACION.LABEL_DESDE;
     //Label para input fecha hasta
    labelHasta: any = this.CONSTANTES_LIQUIDACION.LABEL_HASTA;
    //Variable para cargar las liquidaciones diponibles
    liquidacionesDisponibles = 0;
    //Fecha inicio por defecto
    fechaInicioHabitat = this.restarAnios(new Date(), this.CONSTANTES_LIQUIDACION.ANIOS_LIMITE_INICIO);
    //Fecha máxima por defecto
    fechaMaximaActual = (new Date()).toISOString();
    //Flag para marcar la carga inical del component
    flagCargaInicio  = false;

    constructor(
        private readonly datePipe: DatePipe,
        private readonly contextoApp: ContextoAPP,
        private readonly navCtrl: NavController,
        private readonly utilService: UtilService,
        private readonly liquidacionesService: LiquidacionesService,
    ) {}

    ngOnInit() {
        this.cambioTipoPeriodo(this.CONSTANTES_LIQUIDACION.ULTIMOS_24_MESES);
        this.rut = this.contextoApp.datosCliente.rut;
        this.dv = this.contextoApp.datosCliente.dv;
        this.email = this.contextoApp.datosCliente.email;
    }

     /**
     * Resta años a fecha inicial
     * @param fecha
     * @param anios
     */
    restarAnios(fecha: any , anios: any) {
        fecha.setFullYear(fecha.getFullYear() - anios);
        fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd')
        return fecha as string;
    }

    /**
     * Seleccion de periodo de tiempo, en caso de seleccionar Elegir fechas, se activa
     * selector de fechas manual
     */
    cambioTipoPeriodo(periodo?: string) {
        if(periodo){
            this.tipoPeriodo.tipo = periodo
            this.flagCargaInicio = true;
        }else{
            this.flagCargaInicio = false
        }

        this.liquidacionesDisponibles = 0;

        if (this.tipoPeriodo === undefined || this.tipoPeriodo === null) {

            this.showFormDate = false;
        } else {
            this.habilitaFechaHasta = true;
            this.fechaHasta = '';
            this.fechaDesde = '';

            if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.RANGO_FECHAS_ABIERTO) {
                this.mostrarNoDisponible = false;
                this.showFormDate = true;
            } else if (
                this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_6_MESES ||
                this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_12_MESES ||
                this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_24_MESES

            ) {
                this.showFormDate = false;
            } else if (this.tipoPeriodo.tipo !== this.CONSTANTES_LIQUIDACION.RANGO_FECHAS_ABIERTO) {
                this.showFormDate = false;
            }
        }

        if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_6_MESES) {
            this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(0);
            this.tipoPeriodo.hasta = this.formartearFecha(new Date());
        } else if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_12_MESES) {
            this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(1);
            this.tipoPeriodo.hasta = this.formartearFecha(new Date());
        } else if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_24_MESES) {
            this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(2);
            this.tipoPeriodo.hasta = this.formartearFecha(new Date());
        }
        if(!this.showFormDate){
            this.cargarLiquidacionesDisponibles();
        }
    }

    /**
     * Genera fecha maxima posible de acuerdo a fecha inicial seleccionada
     */
    calcularFechaHasta() {
        this.fechaMinimaCalculada = this.fechaDesde;
        const dateNow = new Date();
        const anoActual: number = dateNow.getFullYear();
        const mesActual: number = dateNow.getMonth();

        // Obtiene año y mes de fecha completa ej: 2022-10-25T10:54:00-05:00
        // anoFechaDesde = 2022
        // mesFechaDesde = 10

        const anoFechaDesde: number = parseInt(this.fechaDesde.substring(0, this.CONSTANTES_LIQUIDACION.INDICE_CAPTURA_ANIO));
        const mesFechaDesde: number = parseInt(this.fechaDesde.substring(
            this.CONSTANTES_LIQUIDACION.INDICE_CAPTURA_MES_INICIO,
            this.CONSTANTES_LIQUIDACION.INDICE_CAPTURA_MES_FIN)) - 1;
        let mesCalculado: number = mesFechaDesde;
        let anoCalculado: number = anoFechaDesde + this.CONSTANTES_LIQUIDACION.SUMA_ANIOS_TOPE;

        if (anoCalculado > anoActual) {
            anoCalculado = anoActual;
            mesCalculado = mesActual;
        }

        const fechaMaxima = (new Date(anoCalculado, mesCalculado, 1)).toString();
        this.fechaMaximaCalculada = this.datePipe.transform(fechaMaxima, 'yyyy-MM');
        this.habilitaFechaHasta = false;
        this.labelDesde = this.datePipe.transform(this.fechaDesde, 'MM-yyyy');

        if (!this.fechaHasta) {
            const endDate = new Date(this.fechaHasta);
            const maxDate = new Date(this.fechaMaximaCalculada);
            const minDate = new Date(this.fechaDesde);

            if (endDate.getTime() > maxDate.getTime() || endDate.getTime() < minDate.getTime()) {
                this.fechaHasta = '';
            }
        }
    }

     /**
     * Función que selecciona la fecha Hasta
     */
    seleccionFechaHasta() {
        this.labelHasta = this.datePipe.transform(this.fechaHasta, 'MM-yyyy');
        this.tipoPeriodo.desde = this.formartearFecha(this.fechaDesde);
        this.tipoPeriodo.hasta = this.formartearFecha(this.fechaHasta);
        this.cargarLiquidacionesDisponibles();
    }

    /**
     * Función que trae liquidacion seleccionado
     */
    async solicitarLiquidacion() {
        const loading = await this.contextoApp.mostrarLoading();
        if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.RANGO_FECHAS_ABIERTO) {
            this.tipoPeriodo.desde = this.formartearFecha(this.fechaDesde);
            this.tipoPeriodo.hasta = this.formartearFecha(this.fechaHasta);
        } else if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_6_MESES) {
            this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(0);
            this.tipoPeriodo.hasta = this.formartearFecha(new Date());
        } else if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_12_MESES) {
            this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(1);
            this.tipoPeriodo.hasta = this.formartearFecha(new Date());
        } else if (this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_24_MESES) {
            this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(2);
            this.tipoPeriodo.hasta = this.formartearFecha(new Date());
        }

        this.liquidacionesService.solicitarLiquidacion(this.rut, this.dv, this.tipoPeriodo.desde, this.tipoPeriodo.hasta, )
            .subscribe((certificado) => {
                AppComponent.descargaPDF = certificado.pdf;
                this.contextoApp.ocultarLoading(loading);
                const parametros: NavigationExtras = {
                    queryParams: {
                      liquidacionesDisponibles: this.liquidacionesDisponibles
                    }
                };
                this.navCtrl.navigateForward(['LiquidacionGeneradoComponent'], parametros);

            }, () => {
                this.contextoApp.ocultarLoading(loading);
                this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.homeCliente));
            });
    }

    /**
     * Transforma fecha a formato dd-MM-yyyy
     * @param fecha
     */
    formartearFecha(fecha): string {
        if (fecha.length === 7) {
            return this.datePipe.transform(`${fecha} -01`, 'dd/MM/yyyy') as string;
        } else {
            return this.datePipe.transform(fecha, 'dd/MM/yyyy') as string;
        }
    }

    /**
     * Resta años a fecha para generar rango de tiempo seleccionado
     * @param restar
     */
    restaAnoSegunFechaActual(restar: number): string {
        const fechaActual = new Date();
        let ano: string = restar !== 0 ?  (fechaActual.getFullYear() - restar).toString(): (fechaActual.getFullYear()).toString();
        let mes: string = restar === 0 ? (fechaActual.getMonth() - this.CONSTANTES_LIQUIDACION.RESTAR_MESE_PERIODO).toString() :  (fechaActual.getMonth() + 1).toString();
        if(parseInt(mes,10) < 0){
            mes = (12 + parseInt(mes,10)).toString();
            ano = (parseInt(ano,10) - 1).toString();
        }
        const dia: string = (fechaActual.getDay()).toString();

        const fechaDia = ((dia.length === 1) ? `0${dia}/` : `${dia}/`);
        const fechaMes =  ((mes.length === 1) ? `0${mes}/${ano}`: `${mes}/${ano}`);

        return `${fechaDia}${fechaMes}`
    }

    /**
     * Redireccion a home app
     */
    cancelar() {
        this.navCtrl.navigateRoot('HomeClientePage');
    }

   /**
   * Metodo encargado de obtener las liquidaciones disponibles
   */
  async cargarLiquidacionesDisponibles(): Promise<void> {
    const loading = await this.contextoApp.mostrarLoading();

    this.liquidacionesService.consultarPeriodos(this.tipoPeriodo.desde, this.tipoPeriodo.hasta, this.rut, this.dv).subscribe((response) => {
        this.liquidacionesDisponibles = response.cantidad;
        this.verificarCantidades();
        this.contextoApp.ocultarLoading(loading);
    }, ()=>{
      this.contextoApp.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.homeCliente));
    });
  }

    /**
    * Función que verifica las liquidaciones disponibles y sus errores respectivos
    */
    verificarCantidades(){
        this.mostrarNoDisponible = false;
        this.mostrarNoDisponible24 = false;
        if(!this.showFormDate && this.liquidacionesDisponibles === 0 && this.tipoPeriodo.tipo !== this.CONSTANTES_LIQUIDACION.ULTIMOS_24_MESES){
            this.mostrarNoDisponible = true;
        }else if(!this.showFormDate && this.liquidacionesDisponibles === 0 && this.tipoPeriodo.tipo === this.CONSTANTES_LIQUIDACION.ULTIMOS_24_MESES){
            this.mostrarNoDisponible24 = true;
        }else if (this.showFormDate && this.liquidacionesDisponibles === 0 ){
            this.mostrarNoDisponible = true;
        }
    }

    /**
    * Encargada de realizar acción de llamar a contact center.
    */
    llamarContactCenter() {
        window.open(`tel:${this.CONSTANTES_LIQUIDACION.TELEFONO_CONTACT}`, '_system');
    }
}
