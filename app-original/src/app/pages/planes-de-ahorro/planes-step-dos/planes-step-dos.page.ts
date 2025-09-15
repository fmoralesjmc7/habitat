import {ApplicationRef, Component, ElementRef, OnInit} from '@angular/core';
import {AlertController, NavController} from "@ionic/angular";
import {
    CONSTANTES_PLANES_STEP_2, CONSTANTES_PLANES_STEP_3,
    CONSTANTES_TRAZA_GENERAL,
    TRAZAS_PLANES,
    CONSTANTES_TRAZAS_PLAN
} from "src/app/pages/planes-de-ahorro/util/constantes.planes";
import { SolicitudCuentaPlanAhorro } from 'src/app/services/api/data/solicitud.cuenta.planahorro'; 
import {ActivatedRoute, NavigationExtras} from "@angular/router";
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { ParametroTraza } from 'src/app/util/parametroTraza'; 
import { PlanesService,UtilService,TrazabilidadService } from 'src/app/services'; 
import { AppComponent } from 'src/app/app.component'; 
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
    selector: 'app-planes-step-dos',
    templateUrl: './planes-step-dos.page.html',
    styleUrls: ['./planes-step-dos.page.scss'],
})
export class PlanesStepDosPage implements OnInit {

    readonly CONSTANTES = CONSTANTES_PLANES_STEP_2;
    readonly CONSTANTES_STEP_3 = CONSTANTES_PLANES_STEP_3;
    readonly CONSTANTES_TRAZA = TRAZAS_PLANES;
    readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;

    mostrarModalMandato: boolean = false;
    tipoModal: number;
    modalData = {};
    email: string;
    aceptaMandato: boolean = false;
    rechazaMandato: boolean = false;
    cuentaSeleccionada: number;
    fechaTermino: Date;

    solicitudDePlan: SolicitudCuentaPlanAhorro;
    envioSolicitudDePlan: boolean = false; //Validacion para asegurar que solo se enviará una solicitud de plan de ahorro

    /**
     * UUID utilizado en las trazas del flujo
     */
    uuid: string;

    constructor(
        private navCtrl: NavController,
        private route: ActivatedRoute,
        private contextoAPP: ContextoAPP,
        private ref: ApplicationRef,
        private planesService: PlanesService,
        private alertCtrl: AlertController,
        private utilService: UtilService,
        private trazabilidadService: TrazabilidadService,
        public element: ElementRef
    ) {

    }

    async ngOnInit() {
        AppComponent.accesoPlanes = this.CONSTANTES.ACCESO_PAGINA2;
        this.solicitudDePlan = new SolicitudCuentaPlanAhorro();

        this.email = this.contextoAPP.datosCliente.email;

        this.route.queryParams.subscribe(async params => {
            const loading = await this.contextoAPP.mostrarLoading();
            let data = params.data;
            let solicitudTemporal = JSON.parse(data).objetoSolicitud;
            await this.crearSolicitud(solicitudTemporal);
            this.cuentaSeleccionada = JSON.parse(data).cuentaSeleccionada;

            if (!this.solicitudDePlan.fechaIndefinida) {
                this.fechaTermino = new Date();
                this.fechaTermino.setMonth(this.solicitudDePlan.mesSeleccionado)
                this.fechaTermino.setFullYear(this.solicitudDePlan.anioSeleccionado)
            }

            this.uuid = await this.utilService.getStorageUuid();

            //Los textos son enviados a función que formatea a primera letra en mayuscula
            this.solicitudDePlan.empleadorSeleccionado.razon_social = this.primeraLetraMayuscula(this.solicitudDePlan.empleadorSeleccionado.razon_social);
            this.solicitudDePlan.comunaSeleccionada.nombre_comuna = this.primeraLetraMayuscula(this.solicitudDePlan.comunaSeleccionada.nombre_comuna);
            this.solicitudDePlan.regionSeleccionada.nombre_region = this.primeraLetraMayuscula(this.solicitudDePlan.regionSeleccionada.nombre_region);
            this.solicitudDePlan.calle = this.primeraLetraMayuscula(this.solicitudDePlan.calle);
            //Email se formatea a letras minusculas
            this.solicitudDePlan.correo = this.solicitudDePlan.correo.toLowerCase();

            if (this.cuentaSeleccionada == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
                this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_INICIO.CODIGO_OPERACION)
            } else {
                this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_INICIO.CODIGO_OPERACION)
            }

            /**
             * Reajuste de espacio en rows con datos rellenados en step 1 para casos en que
             * el texto no cabe en el espacio asignado.
             */
            setTimeout(async () => {
                    await this.ajusteDeTamanio();
                    this.contextoAPP.ocultarLoading(loading);
                },
                1000);
        });

    }

    /**
     * Se muestra modal para regimenes y se asignan los textos correspondientes
     */
    verModalMandato() {
        this.mostrarModalMandato = true;
        this.tipoModal = this.CONSTANTES.MODAL_INFORMATIVO_STEP2;
        this.modalData = {
            titulo: this.CONSTANTES.TITULO_MODAL_MANDATO,
            texto1: this.CONSTANTES.TEXTO1_MODAL_MANDATO,
            texto2: this.CONSTANTES.TEXTO2_MODAL_MANDATO,
            boton: null
        };
    }

    /**
     * Encargado de cerrar modal para regímenes
     */
    ocultarModalMandato() {
        this.mostrarModalMandato = false;
    }

    /**
     * Redireccion al paso 3 y envio de solicitud de planes
     */
    async continuarStep3() {

        const loading = await this.contextoAPP.mostrarLoading();

        if(this.envioSolicitudDePlan == true){
            this.contextoAPP.ocultarLoading(loading);
            return;
        }
        //Solo entra a llamada de servicios si es la primera petición
        this.envioSolicitudDePlan = true;
        let solicitudEnFormatoServicios;
        //Se crea fecha de inicio con mes y año de primer descuento en el dia 1
        let fechaInicio = new Date(this.solicitudDePlan.primerDescuento);
        fechaInicio.setDate(1);
        let fechaTermino = new Date();
        //Fecha de pago es un mes mas a la fecha de inicio (lógicas de negocio)
        let fechaPago = new Date(fechaInicio);
        fechaPago.setMonth((fechaPago.getMonth() + 1));
        if (!this.solicitudDePlan.fechaIndefinida) {
            //Si no se seleccionó fecha indefinida, se crea fecha de término con el dia 1 del mes y año seleccionado
            fechaTermino.setDate(1);
            fechaTermino.setMonth(this.solicitudDePlan.mesSeleccionado);
            fechaTermino.setFullYear(this.solicitudDePlan.anioSeleccionado);
        }
        //Datos de usuario
        let rut = this.contextoAPP.datosCliente.rut;
        let dv = this.contextoAPP.datosCliente.dv;

        if (this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2) { //Cuenta 2 - CAV

            solicitudEnFormatoServicios = {
                "rut_usuario": String(rut),
                "tipoProducto": "CAV",
                "tipo_cargo": this.sacarTildesEnieTexto(this.solicitudDePlan.cargoSeleccionado.nombre_cargo),
                "firma_mandato": this.solicitudDePlan.aceptaMandato ? "1" : "0",
                "id_tipo_cargo": String(this.solicitudDePlan.cargoSeleccionado.id_cargo),
                "marca_indefinido": this.solicitudDePlan.fechaIndefinida ? "1" : "0",
                "fecha_inicio": fechaInicio.getFullYear() + "-" + this.obtenerMesHoraConCero((fechaInicio.getMonth() + 1)) + "-" + this.obtenerMesHoraConCero(fechaInicio.getDate()),
                "fecha_fin": this.solicitudDePlan.fechaIndefinida ? "" : fechaTermino.getFullYear() + "-" + this.obtenerMesHoraConCero(fechaTermino.getMonth() + 1) + "-" + this.obtenerMesHoraConCero(fechaTermino.getDate()),
                "fecha_pago": fechaPago.getFullYear() + "-" + this.obtenerMesHoraConCero(fechaPago.getMonth() + 1) + "-" + this.obtenerMesHoraConCero(fechaPago.getDate()),
                "monto_solicitud": this.formatoMontoParaEnvioCAV(this.solicitudDePlan.tipoSeleccionado.id_tipo_moneda, this.solicitudDePlan.montoSeleccionado),
                "porcentaje_solicitud": this.formatoPorcentajeParaEnvio(this.solicitudDePlan.tipoSeleccionado.id_tipo_moneda, this.solicitudDePlan.montoSeleccionado),
                "id_tipo_fondo": String(this.solicitudDePlan.fondoSeleccionado.id_tipo_fondo),
                "nombre_fondo": this.solicitudDePlan.fondoSeleccionado.nombre_tipo_fondo,
                "id_regimen": String(this.solicitudDePlan.regimenSeleccionado.id_regimen),
                "nombre_regimen": this.solicitudDePlan.regimenSeleccionado.nombre_regimen,
                "id_ciudad_empleador": this.solicitudDePlan.ciudadSeleccionada.id_ciudad,
                "id_region_empleador": String(this.solicitudDePlan.regionSeleccionada.id_region),
                "id_comuna_empleador": String(this.solicitudDePlan.comunaSeleccionada.id_comuna),
                "nombre_region_empleador": this.formatoRomanoRegiones(this.solicitudDePlan.regionSeleccionada.id_region),
                "nombre_ciudad_empleador": this.solicitudDePlan.ciudadSeleccionada.nombre_ciudad,
                "nombre_comuna_empleador": this.sacarTildesEnieTexto(this.solicitudDePlan.comunaSeleccionada.nombre_comuna),
                "cod_postal_empleador": this.solicitudDePlan.codigoPostal ? this.solicitudDePlan.codigoPostal : '0',
                "direccion_empleador": this.sacarTildesEnieTexto(this.solicitudDePlan.calle),
                "numero_empleador": this.solicitudDePlan.numero,
                "numero_oficina_empleador": this.solicitudDePlan.oficina ? this.solicitudDePlan.oficina : "",
                "mae_empleador": String(this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador),
                "razon_social_empleador": this.solicitudDePlan.empleadorSeleccionado.razon_social,
                "correo_empleador": this.solicitudDePlan.correo,
                "rut_empleador": this.solicitudDePlan.rutEmpleador,
                "dv_empleador": this.solicitudDePlan.dvEmpleador,
                "renta_imponible": this.formatoMontoParaEnvioCAV(this.CONSTANTES.TIPO_MONEDA_PESO, this.solicitudDePlan.rentaImponible),
            };
        } else { //APV
            solicitudEnFormatoServicios = {
                "rut_usuario": String(rut),
                "tipoProducto": "APV",
                "id_tipo_valor": String(this.solicitudDePlan.tipoSeleccionado.id_tipo_moneda),
                "tipo_cargo": this.sacarTildesEnieTexto(this.solicitudDePlan.cargoSeleccionado.nombre_cargo),
                "id_tipo_cargo": String(this.solicitudDePlan.cargoSeleccionado.id_cargo),
                "marca_indefinido": this.solicitudDePlan.fechaIndefinida ? "1" : "2",
                "fecha_inicio": fechaInicio.getFullYear() + "-" + this.obtenerMesHoraConCero((fechaInicio.getMonth() + 1)) + "-" + this.obtenerMesHoraConCero(fechaInicio.getDate()),
                "fecha_fin": this.solicitudDePlan.fechaIndefinida ? "" : fechaTermino.getFullYear() + "-" + this.obtenerMesHoraConCero(fechaTermino.getMonth() + 1) + "-" + this.obtenerMesHoraConCero(fechaTermino.getDate()),
                "fecha_pago": fechaPago.getFullYear() + "-" + this.obtenerMesHoraConCero(fechaPago.getMonth() + 1) + "-" + this.obtenerMesHoraConCero(fechaPago.getDate()),
                "monto_solicitud": this.formatoMontoParaEnvioAPV(this.solicitudDePlan.montoSeleccionado),
                "id_tipo_fondo": String(this.solicitudDePlan.fondoSeleccionado.id_tipo_fondo),
                "nombre_fondo": this.solicitudDePlan.fondoSeleccionado.nombre_tipo_fondo,
                "id_regimen": String(this.solicitudDePlan.regimenSeleccionado.id_regimen),
                "nombre_regimen": this.solicitudDePlan.regimenSeleccionado.nombre_regimen,
                "id_ciudad_empleador": this.solicitudDePlan.ciudadSeleccionada.id_ciudad,
                "id_region_empleador": String(this.solicitudDePlan.regionSeleccionada.id_region),
                "id_comuna_empleador": String(this.solicitudDePlan.comunaSeleccionada.id_comuna),
                "nombre_region_empleador": this.solicitudDePlan.regionSeleccionada.nombre_region,
                "nombre_ciudad_empleador": this.solicitudDePlan.ciudadSeleccionada.nombre_ciudad,
                "nombre_comuna_empleador": this.sacarTildesEnieTexto(this.solicitudDePlan.comunaSeleccionada.nombre_comuna),
                "cod_postal_empleador": this.solicitudDePlan.codigoPostal ? this.solicitudDePlan.codigoPostal : '0',
                "direccion_empleador": this.sacarTildesEnieTexto(this.solicitudDePlan.calle),
                "numero_empleador": this.solicitudDePlan.numero,
                "numero_oficina_empleador": this.solicitudDePlan.oficina ? this.solicitudDePlan.oficina : "",
                "mae_empleador": String(this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador),
                "razon_social_empleador": this.solicitudDePlan.empleadorSeleccionado.razon_social,
                "correo_empleador": this.solicitudDePlan.correo,
                "rut_empleador": this.solicitudDePlan.rutEmpleador,
                "dv_empleador": this.solicitudDePlan.dvEmpleador,
                "renta_imponible": this.formatoMontoParaEnvioCAV(this.CONSTANTES.TIPO_MONEDA_PESO, this.solicitudDePlan.rentaImponible),
            };
        }

        this.planesService.ejecutarSolicitud(rut, dv, JSON.stringify(solicitudEnFormatoServicios)).subscribe(async (respuestaSolicitud: any) => {
            //Si la respuesta es correcta, antes de redireccionar se guarda la cuenta seleccionada, el numero de folio y la data para pdf
            if (respuestaSolicitud.exito === 'true' && respuestaSolicitud.estado_solicitud === 'true') {
                if (this.solicitudDePlan.aceptaMandato) {
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_ACEPTA_MANDATO.CODIGO_OPERACION);
                } else {
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_NO_ACEPTA_MANDATO.CODIGO_OPERACION);
                }
                AppComponent.descargaPDF = respuestaSolicitud.pdf;
                this.contextoAPP.ocultarLoading(loading);
                if (this.email) {
                    this.enviarCorreo(respuestaSolicitud.pdf, respuestaSolicitud.numero_folio);
                } else {

                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            cuenta: JSON.stringify(this.cuentaSeleccionada),
                            numero_folio: respuestaSolicitud.numero_folio
                        }
                    };
                    if (this.cuentaSeleccionada == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
                        await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_3_INICIO.CODIGO_OPERACION);
                    } else {
                        await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_3_INICIO.CODIGO_OPERACION);
                    }
                    this.navCtrl.navigateForward(['planes-step-tres'], navigationExtras);
                }
            } else {
                this.contextoAPP.ocultarLoading(loading);
                if (this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
                    this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_ERROR.CODIGO_OPERACION)
                } else {
                    this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_ERROR.CODIGO_OPERACION);
                }
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
            }
        }, async (error) => {
            if (this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
                this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_ERROR.CODIGO_OPERACION)
            } else {
                this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_ERROR.CODIGO_OPERACION);
            }
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
        });
    }

     /**
   * Encargado de reemplazar tildes a código html 
   * @param nombre 
   */
  sacarTildesEnieTexto(nombre:string){
    nombre = nombre.replace(/á/g, '&aacute;');
    nombre = nombre.replace(/é/g, '&eacute;');
    nombre = nombre.replace(/í/g, '&iacute;');
    nombre = nombre.replace(/ó/g, '&oacute;');
    nombre = nombre.replace(/ú/g, '&uacute;');
    nombre = nombre.replace(/ñ/g, '&ntilde;');

    nombre = nombre.replace(/Á/g, '&Aacute;');
    nombre = nombre.replace(/É/g, '&Eacute;');
    nombre = nombre.replace(/Í/g, '&Iacute;');
    nombre = nombre.replace(/Ó/g, '&Oacute;');
    nombre = nombre.replace(/Ú/g, '&Uacute;');
    nombre = nombre.replace(/Ñ/g, '&Ntilde;');

    return nombre;
  }
  
    /**
     * Envío de correo a usuario con la información de la solicitud procesada y el pdf generado
     * (el envio se realiza desde step 2 ya que al enviar el pdf al step 3 se genera un problema
     * al enviar el correo debido a que la url que envia es muiy grande y )
     * @param pdfBytesArraySolicitud
     * @param numeroFolio
     */
    async enviarCorreo(pdfBytesArraySolicitud, numeroFolio){
        const loading = await this.contextoAPP.mostrarLoading();
        let fechaRetiroDate = new Date();
        let diaRetiro = this.obtenerMesHoraConCero(fechaRetiroDate.getDate());
        let mesRetiro = fechaRetiroDate.getMonth() + 1; //Enero es 0!
        let mesRetiroString = this.obtenerMesHoraConCero(mesRetiro.toString());
        let anioRetiro = fechaRetiroDate.getFullYear();
        let horas = this.obtenerMesHoraConCero(fechaRetiroDate.getHours());
        let minutos = this.obtenerMesHoraConCero(fechaRetiroDate.getMinutes());
        let segundos = this.obtenerMesHoraConCero(fechaRetiroDate.getSeconds());
        let horaSolicitud = horas + ":" + minutos + ":" + segundos;

        let fechaSolicitud: string = diaRetiro + "/" + mesRetiroString + "/" + anioRetiro;
        let fechaHora: string = anioRetiro + "-" + mesRetiroString + "-" + diaRetiro;
        fechaHora = fechaHora + "T" + horaSolicitud;

        let parametrosCorreo = {
            rut: String(this.contextoAPP.datosCliente.rut),
            dv: this.contextoAPP.datosCliente.dv,
            nombreCompleto: this.crearNombreCompleto(this.contextoAPP.datosCliente),
            archivo: pdfBytesArraySolicitud,
            nombreArchivo: this.crearNombreArchivo(),
            titulo: this.crearTitulo(),
            textoLibre: this.crearTextoLibre(fechaSolicitud),
            fecha: fechaHora,
            tipoOperacion: this.crearTipoOperacion(),
            correoEnviar: this.contextoAPP.datosCliente.email,
            numeroSolicitud: numeroFolio
        };
        this.planesService.enviarCorreoSolicitud(parametrosCorreo).subscribe( async (response: any) => {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    cuenta: JSON.stringify(this.cuentaSeleccionada),
                    numero_folio: numeroFolio
                }
            };
            if(this.cuentaSeleccionada == this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_3_INICIO.CODIGO_OPERACION)
            }else{
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_3_INICIO.CODIGO_OPERACION)
            }

            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateForward(['planes-step-tres'], navigationExtras);
        }, async (error) => {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    cuenta: JSON.stringify(this.cuentaSeleccionada),
                    numero_folio: numeroFolio
                }
            };

            if(this.cuentaSeleccionada == this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_3_ERROR.CODIGO_OPERACION)
            }else{
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_3_ERROR.CODIGO_OPERACION)
            }
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateForward(['planes-step-tres'], navigationExtras);
        });
    }

    /**
     * El servicio se alimienta de hora con formato 2019-06-25 01:12:11 , se debe agregar un cero a la iz , cuando aplique.
     * @param valor
     */
    obtenerMesHoraConCero(valor){
        return String("00" + valor).slice(-2);
    }

    /**
     * Crea variable nombreCompleto con nombre y apellidos de cliente
     * @param datosCliente
     */
    crearNombreCompleto(datosCliente){
        return datosCliente.nombre + " " + datosCliente.apellidoPaterno + " " + datosCliente.apellidoMaterno;
    }

    /**
     * Crea variable nombreArchivo segun tipo de cuenta seleccionada
     */
    crearNombreArchivo(){
        if(this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
            return this.CONSTANTES_STEP_3.NOMBRE_ARCHIVO_CORREO_CUENTA_2;
        }else{
            return this.CONSTANTES_STEP_3.NOMBRE_ARCHIVO_CORREO_APV;
        }
    }

    /**
     * Crea variable para titulo de correo segun tipo de cuenta seleccionada
     */
    crearTitulo(){
        if(this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
            return this.CONSTANTES_STEP_3.TITULO_CORREO_CUENTA_2;
        }else{
            return this.CONSTANTES_STEP_3.TITULO_CORREO_APV;
        }
    }

    /**
     * Crea variable para texto de correo segun tipo de cuenta seleccionada
     * @param fechaSolicitud
     */
    crearTextoLibre(fechaSolicitud){
        if(this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
            return this.CONSTANTES_STEP_3.TEXTO_LIBRE_CORREO_CUENTA_2.replace(this.CONSTANTES_STEP_3.FECHA_TEXTO_LIBRE_CORREO, fechaSolicitud);
        }else{
            return this.CONSTANTES_STEP_3.TEXTO_LIBRE_CORREO_APV.replace(this.CONSTANTES_STEP_3.FECHA_TEXTO_LIBRE_CORREO, fechaSolicitud);
        }
    }

    /**
     * Crea variable para texto de tipo de operación segun tipo de cuenta seleccionada
     */
    crearTipoOperacion(){
        if(this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
            return this.CONSTANTES_STEP_3.TIPO_OPERACION_CORREO_CUENTA_2;
        }else{
            return this.CONSTANTES_STEP_3.TIPO_OPERACION_CORREO_APV;
        }
    }

    /**
     * Segun el tipo de moneda seleccionada, se evalua el retorno para el campo monto para CAV
     * @param fondo
     * @param monto
     */
    formatoMontoParaEnvioCAV(tipo_moneda: number, monto: string) {
        let re = /\./gi;
        let result = monto.replace(re, "");
        result = result.replace('$', "");

        if (tipo_moneda === this.CONSTANTES.TIPO_MONEDA_UF) { //UF
            return String(result);
        } else if (tipo_moneda === this.CONSTANTES.TIPO_MONEDA_PORCENTAJE) { //Porcentaje
            return "-1";
        } else if (tipo_moneda === this.CONSTANTES.TIPO_MONEDA_PESO) { //Pesos
            return String(result);
        }
    }

    /**
     * Formatea monto para que sea aguantado por el servicio
     * @param fondo
     * @param monto
     */
    formatoMontoParaEnvioAPV(monto: string) {
        let re = /\./gi;
        let result = monto.replace(re, "");
        return String(result);
    }

    /**
     * Segun el tipo de moneda seleccionada, se evalua el retorno para el campo porcentaje
     * @param fondo
     * @param porcentaje
     */
    formatoPorcentajeParaEnvio(tipo_moneda: number, porcentaje: string) {
        if (tipo_moneda === this.CONSTANTES.TIPO_MONEDA_UF) { //UF
            return "-1.0";
        } else if (tipo_moneda === this.CONSTANTES.TIPO_MONEDA_PORCENTAJE) { //Porcentaje
            return String(porcentaje) + ".0";
        } else if (tipo_moneda === this.CONSTANTES.TIPO_MONEDA_PESO) { //Pesos
            return "-1.0";
        }
    }


    /**
     * Funcion que cambia el valor de aceptar o no aceptar mandato segun lo que se seleccione
     * @param seleccion
     */
    seleccionaMandato(desde: string) {


        if (desde == this.CONSTANTES.ACEPTA_MANDATO) {
            this.aceptaMandato = true;
            this.rechazaMandato = false;
            this.solicitudDePlan.aceptaMandato = true;
        } else if (desde == this.CONSTANTES.RECHAZA_MANDATO) {
            this.aceptaMandato = false;
            this.rechazaMandato = true;
            this.solicitudDePlan.aceptaMandato = false;
        }
    }

    /**
     * Se comprueba que el usuario haya seleccionado la declaracion de mandato, en caso
     * de ser cuenta APV, el boton siempre estará activado
     */
    validarEstadoBotonAceptar() {
        if (this.cuentaSeleccionada === this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
            return this.solicitudDePlan.declaraMandato;
        } else {
            return true;
        }
    }

    /**
     * Crear objeto de tipo de solicitud con los datos enviados desde step1
     * @param solicitudTemporal
     */
    async crearSolicitud(solicitudTemporal) {
        this.solicitudDePlan.aceptaMandato = solicitudTemporal._aceptaMandato;
        this.solicitudDePlan.anioSeleccionado = solicitudTemporal._anioSeleccionado;
        this.solicitudDePlan.autorizacionEmpleador = solicitudTemporal._autorizacionEmpleador;
        this.solicitudDePlan.calle = solicitudTemporal._calle;
        this.solicitudDePlan.cargoSeleccionado = solicitudTemporal._cargoSeleccionado;
        this.solicitudDePlan.comunaSeleccionada = solicitudTemporal._comunaSeleccionada;
        this.solicitudDePlan.ciudadSeleccionada = solicitudTemporal._ciudadSeleccionada;
        this.solicitudDePlan.correo = solicitudTemporal._correo;
        this.solicitudDePlan.declaraMandato = solicitudTemporal._declaraMandato;
        this.solicitudDePlan.empleadorSeleccionado = solicitudTemporal._empleadorSeleccionado;
        this.solicitudDePlan.fechaIndefinida = solicitudTemporal._fechaIndefinida;
        this.solicitudDePlan.fondoSeleccionado = solicitudTemporal._fondoSeleccionado;
        this.solicitudDePlan.mesSeleccionado = solicitudTemporal._mesSeleccionado;
        this.solicitudDePlan.montoSeleccionado = solicitudTemporal._montoSeleccionado;
        this.solicitudDePlan.numero = solicitudTemporal._numero;
        this.solicitudDePlan.oficina = solicitudTemporal._oficina;
        this.solicitudDePlan.primerDescuento = solicitudTemporal._primerDescuento;
        this.solicitudDePlan.regimenSeleccionado = solicitudTemporal._regimenSeleccionado;
        this.solicitudDePlan.regionSeleccionada = solicitudTemporal._regionSeleccionada;
        this.solicitudDePlan.rentaImponible = solicitudTemporal._rentaImponible;
        this.solicitudDePlan.tipoSeleccionado = solicitudTemporal._tipoSeleccionado;

        this.solicitudDePlan.codigoPostal = solicitudTemporal._codigoPostal;
        this.solicitudDePlan.rutEmpleador = solicitudTemporal._rutEmpleador;
        this.solicitudDePlan.dvEmpleador = solicitudTemporal._dvEmpleador;
        this.solicitudDePlan.idTipoTrabajador = solicitudTemporal.id_tipo_trabajador_empleador;
    }

    /**
     * Encargado de mostrar alerta de confirmación cuando el usuario intenta cancelar.
     */
    eventoCancelar() {
        const titulo: string = 'Importante';
        const mensaje: string = 'Al continuar, perderás los datos ya ingresados.';
        const botones: any[] = [
            {
                text: 'CANCELAR',
                handler: () => {}
            },
            {
                text: 'CONTINUAR',
                handler: () => {
                    if (this.cuentaSeleccionada == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
                        this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_CANCELAR.CODIGO_OPERACION)
                    } else {
                        this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_CANCELAR.CODIGO_OPERACION)
                    }
                    this.navCtrl.navigateRoot('HomeClientePage');
                }
            }
        ];
        this.mostrarAlert(titulo, mensaje, botones);
    }


    /**
     * Encargado de mostrar alerta.
     * @param titulo
     * @param mensaje
     * @param botones
     */
    mostrarAlert(titulo: string, mensaje: string, botones: any[]) {
        const confirm = this.alertCtrl.create({
            header: titulo,
            message: mensaje,
            buttons: botones
        }).then(confirmData => confirmData.present());
    }

    /**
     * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
     * @param parametroTraza
     */
    async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_PLAN,
            uuid : this.uuid,
            rut: this.contextoAPP.datosCliente.rut,
            dv: this.contextoAPP.datosCliente.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_INICIO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_INICIO);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_INICIO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_INICIO);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_ACEPTA_MANDATO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_ACEPTA_MANDATO);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_NO_ACEPTA_MANDATO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_NO_ACEPTA_MANDATO);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_3_INICIO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_3_INICIO);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_3_INICIO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_3_INICIO);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_ERROR);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_ERROR);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_3_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_3_ERROR);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_3_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_3_ERROR);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_CANCELAR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_C2_STEP_2_CANCELAR);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_CANCELAR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP2.COD_APV_STEP_2_CANCELAR);
              break;
          }
          
        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe();
    }

    /**
     * Trnsfomra Id de region en numero romano para envio a servicio (Solo para cuenta 2)
     * @param id_region
     */
    formatoRomanoRegiones(id_region) {
        switch (id_region) {
            case this.CONSTANTES.REGION_1:
                return "I";
            case this.CONSTANTES.REGION_2:
                return "II";
            case this.CONSTANTES.REGION_3:
                return "III";
            case this.CONSTANTES.REGION_4:
                return "IV";
            case this.CONSTANTES.REGION_5:
                return "V";
            case this.CONSTANTES.REGION_6:
                return "VI";
            case this.CONSTANTES.REGION_7:
                return "VII";
            case this.CONSTANTES.REGION_8:
                return "VIII";
            case this.CONSTANTES.REGION_9:
                return "IX";
            case this.CONSTANTES.REGION_10:
                return "X";
            case this.CONSTANTES.REGION_11:
                return "XI";
            case this.CONSTANTES.REGION_12:
                return "XII";
            case this.CONSTANTES.REGION_13:
                return "RM";
            case this.CONSTANTES.REGION_14:
                return "XIV";
            case this.CONSTANTES.REGION_15:
                return "XV";
            case this.CONSTANTES.REGION_16:
                return "XVI";
        }
    }

    /**
     * Ajunta tamaños de casillas para casos en que el texto no quepa en el espacio asignado
     */
    async ajusteDeTamanio() {
        const columnaTituloCalle = document.getElementById("col_calle");
        const columnaTextoCalle = document.getElementById("col_calle2");

        const columnaTituloEmpleador = document.getElementById("col_texto");
        const columnaTextoEmpleador = document.getElementById("col_texto2");

        const columnaTituloRegion = document.getElementById("col_region");
        const columnaTextoRegion = document.getElementById("col_region2");

        columnaTituloRegion!.style.overflow = 'hidden';
        columnaTituloRegion!.style.height = 'auto';
        columnaTituloRegion!.style.height = columnaTextoRegion!.scrollHeight + 'px';

        columnaTextoRegion!.style.overflow = 'hidden';
        columnaTextoRegion!.style.height = 'auto';
        columnaTextoRegion!.style.height = columnaTextoRegion!.scrollHeight + 'px';

        columnaTituloEmpleador!.style.overflow = 'hidden';
        columnaTituloEmpleador!.style.height = 'auto';
        columnaTituloEmpleador!.style.height = columnaTituloEmpleador!.scrollHeight + 'px';

        columnaTextoEmpleador!.style.overflow = 'hidden';
        columnaTextoEmpleador!.style.height = 'auto';
        columnaTextoEmpleador!.style.height = columnaTextoEmpleador!.scrollHeight + 'px';

        columnaTituloCalle!.style.overflow = 'hidden';
        columnaTituloCalle!.style.height = 'auto';
        columnaTituloCalle!.style.height = columnaTituloCalle!.scrollHeight + 'px';

        columnaTextoCalle!.style.overflow = 'hidden';
        columnaTextoCalle!.style.height = 'auto';
        columnaTextoCalle!.style.height = columnaTextoCalle!.scrollHeight + 'px';
    }


    /**
     * Formateo de texto para que la primera letra de cada palabra se muestre en mayuscula
     * @param str
     */
    primeraLetraMayuscula(str) {
        let splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }
}
