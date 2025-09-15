import {Component, OnInit} from '@angular/core';
import {NavController, AlertController} from '@ionic/angular';
import {
    ClienteCuentasDatos,
    DepositoDirectoService,
    UtilService,
    TrazabilidadService
} from '../../../services';
import {Keyboard} from '@capacitor/keyboard';
import {ContextoAPP} from 'src/app/util/contexto-app';
import {LlamadaKhipu} from 'src/app/util/llamada-khipu';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { TRAZAS_DEP_DIRECTO, CONST_GENERALES_TRAZA } from 'src/app/util/constantesTraza';
import khenshin from 'cordova-khenshin/www/khenshin';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { CONSTANTES_TRAZAS_DEPOSITO } from '../util/constantes.deposito';
import { take } from 'rxjs/operators';
import { Bank, BanksResponse } from 'src/app/interfaces/khipu.interface';

@Component({
    selector: 'page-ingreso-datos',
    templateUrl: 'ingreso-datos.page.html',
    styleUrls: ['./ingreso-datos.page.scss']
})
export class IngresoDatosPage implements OnInit {
    readonly CONSTANTES_TRAZA = TRAZAS_DEP_DIRECTO;
    readonly CONSTANTES_TRAZA_GENERAL = CONST_GENERALES_TRAZA;
    rut: number;
    dv: string;
    email: string;
    depDir: any;
    ctaSeleted: string;
    regimenSeleted: string;
    msgCta2NoAperturada = 'Importante: Según nuestros registros, no tienes Cuenta 2, puedes aperturar aquí.';
    codigoProductoCtaDos = 'CAV';
    productosCliente: any[];
    infoRegTribAPVIsOpen = false;
    infoRegTribCAVIsOpen = false;
    infoMedPagoIsOpen = false;
    infoMedPago = 'Tu pago será gestionado a través de Khipu';
    origenesFondo: any[];
    propositos: any[];
    origenesFondoPais: any[];
    slidesApv: any[];
    slidesCav: any[];
    urlAperturaCAV = 'https://www.afphabitat.cl/portalPrivado_FIXWeb/commons/goAliasMenu.htm?alias=APERTURACAV';
    auth: string;

    DECIMAL_SEPARATOR = ',';
    GROUP_SEPARATOR = '.';

    TIPO_CUENTA_APV = 'APV';
    TIPO_CUENTA_CAV = 'CAV';
    TIPO_CUENTA_CUENTA2 = 'CUENTA2';

    TIPO_SUCESO_SUCCESS = 'SUCCESS';
    TIPO_SUCESO_ERROR = 'ERROR';
    TRAZABILIDAD_UUID = 'f8d12f01-ac09-4b72-8bcc-1a865dbac836';

    KEY_CODE = 13;

    ingresoMonto = false;
    seleccionoMedioDePago = false;

    selectOptionsOrigenFondo: any = {
        header: 'Origen de los Fondos'
    };

    selectOptionsPaisOrigenFondo: any = {
        header: 'País de Origen de los Fondos'
    };

    selectOptionsMedioPago: any = {
        header: 'Medio de Pago'
    };

    selectOptionsPropositos: any = {
        header: 'Propósito del Depósito'
    };

    montosValidar: any = {
        montoMin: 0,
        montoMax: 5000000
    };

    listaBancos: Bank[];

    banco: any = {
        activo: 'true',
        ctaCteHabitat: 0,
        horaFinActivacion: '2400',
        horaInicioActivacion: '0',
        idBanco: 10,
        nombreBanco: 'Khipu',
        numConvenio: 0
    };

    canal: any = {
        idCanal: '16',
        nombreCanal: 'APPMOBILE'
    };

    nroTransaccion: number;
    transaccion: any;
    emailValidado: boolean = false;
    name: string;
    envioDeposito: boolean = false; //Validacion para asegurar que solo se enviará una solicitud khipu
    uuid: string;

    constructor(
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private contextoAPP: ContextoAPP,
        private llamadaKhipu: LlamadaKhipu,
        private clienteCuentaService: ClienteCuentasDatos,
        private depDirService: DepositoDirectoService,
        private utilService: UtilService,
        private trazabilidadService: TrazabilidadService,
    ) {
        this.depDir = {};
        this.slidesApv = [
            {
                titulo: 'Régimen A',
                text: 'Con este régimen, el Estado realiza una bonificación anual de un 15% de lo ahorrado con tope' +
                    ' de 6 UTM, pero en caso que retires los ahorros pierdes el beneficio fiscal. Solo tributa por la ' +
                    'rentabilidad obtenido al momento del giro.'
            },
            {
                titulo: 'Régimen B',
                text: 'Con este régimen, el ahorro realizado te permite obtener una rebaja en el impuesto a la'
                    + ' renta con un tope de hasta 600 UF anuales. Si retiras el ahorro se retiene el 15% del monto girado.'
            }
        ];
        this.slidesCav = [
            {
                titulo: 'Régimen General',
                text: 'Este régimen te permite hacer retiros libres de impuestos, hasta por un monto máximo anual '
                    + 'de 30 UTM de ganancia de capital. Si la rentabilidad obtenida por los retiros que hayas efectuado '
                    + 'en el respectivo año excede de ese tope, tributas por esa ganancia de acuerdo a tu global complementario de dicho año.'
            }
        ];
    }

    ngOnInit() {
        //Implementar firebase
        this.clienteCuentaService.productosCliente.subscribe((productos) => {
            this.productosCliente = productos;
        });
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
        this.email = this.contextoAPP.datosCliente.email;

        this.name = this.contextoAPP.datosCliente.nombre + " " + this.contextoAPP.datosCliente.apellidoPaterno;
        if (this.email !== "" && this.email !== null && this.email !== undefined) {
            this.depDir.email = this.email;
            this.emailValidado = true;
        }
        this.uuid = this.utilService.generarUuid();
    }

    async ionViewDidEnter() {
        const loading = await this.contextoAPP.mostrarLoading();
        const isOkPaises = await this.loadOrigenPaises();
        const isOkOrigenFondos = await this.loadOrigenFondos();
        const isOkBancos = await this.loadListaBancos();
        const isOkTrazabilidad = await this.registrarTrazabilidad();
        const isOkPropositos = await this.loadPropositos(); 
        const isOkMinDeposito = await this.loadMinDeposito(); 
        
        if (!isOkPaises || !isOkOrigenFondos || !isOkBancos || !isOkTrazabilidad || !isOkPropositos || !isOkMinDeposito) {
            this.navCtrl.navigateForward('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.depositoDirecto));
        }

        this.depDir.origenFondo = '08';
        this.depDir.paisOrigenFondo = '152';
        this.depDir.codigoProposito = 'OTRO';

        this.contextoAPP.ocultarLoading(loading);
    }

    /**
     * Trae listado de paises seleccionables
     */
    loadOrigenPaises() {
        return new Promise((resolve, reject) => {
            this.depDirService.obtenerParametros('CMB_BOX_PAIS_ORIGEN').subscribe((response: any) => {
                this.origenesFondoPais = this.obtenerDataParametros(response);

                if (this.origenesFondoPais) {
                    this.origenesFondoPais = this.origenesFondoPais.sort((a: any, b: any) => {
                        if (a.nombre < b.nombre) {
                            return -1;
                        }
                        if (a.nombre > b.nombre) {
                            return 1;
                        }
                        return 0;
                    });
                }

                resolve(true);
            }, (error) => {
                resolve(false);
            });
        });
    }

    /**
     * Llamada a servicio para obtener opciones de origen de fondos
     */
    loadOrigenFondos() {
        return new Promise((resolve, reject) => {
            this.depDirService.obtenerParametros('CMB_BOX_ORIGENFONDO').subscribe((response: any) => {
                this.origenesFondo = this.obtenerDataParametros(response);
                resolve(true);
            }, (error) => {
                resolve(false);
            });
        });
    }

    /**
     * Llamada a servicio para obtener opciones de origen de fondos
     */
    loadPropositos() {
        return new Promise((resolve, reject) => {
            this.depDirService.obtenerPropositos().subscribe((response: any) => {
                this.propositos = response;
                resolve(true);
            }, (error) => {
                resolve(false);
            });
        });
    }

     /**
     * Llamada a servicio para el valor minimo del deposito
     */
     loadMinDeposito() {
        return new Promise((resolve, reject) => {
            this.depDirService.obtenerValorMinimo().subscribe((response: any) => {
               this.montosValidar.montoMin = response
                resolve(true);
            }, (error) => {
                resolve(false);
            });
        });
    }

    /**
     * Llamada a servicio khipu para obtener bancos
     */
    loadListaBancos() {
        return new Promise((resolve, reject) => {
            this.depDirService.obtenerBancos(this.rut, this.dv).pipe(take(1)).subscribe({
                next: (res: BanksResponse) => {
                    this.listaBancos = new Array();
                    res.banks.forEach((banco: Bank) => {
                        this.listaBancos.push(banco);
                        resolve(true);
                    });
                },
                error: (error) => {
                    console.error('>>> IngresoDatosPage - loadListaBancos ERROR.', JSON.stringify(error));
                    this.navCtrl.navigateRoot('KhipuErrorPage');
                    reject(false);
                }
            });
        });
    }

    /**
     * Ordena listado de origen de fondos
     * @param parametros
     */
    obtenerDataParametros(parametros: any): any {
        let arrParametros: any;

        if (parametros && parametros.parametros.length > 0) {
            arrParametros = new Array();
            parametros.parametros.forEach((element: any) => {
                const value: any[] = element.value.split(';');
                const param = {
                    id: value[0],
                    nombre: value[1]
                };
                arrParametros.push(param);
            });
        }
        return arrParametros;
    }

    /**
     * Busca valor de cuenta dos en cuentas de cliente
     */
    validaCuenta2Aperturada(): boolean {
        let result = false;
        if (this.productosCliente) {
            this.productosCliente.forEach((producto: any) => {
                if (this.codigoProductoCtaDos == producto.codigoProducto) {
                    result = true;
                }
            });
        }
        return result;
    }

    /**
     * Asigna valores generales para las trazas
     */
    datosGeneralasTrazas(): any {
        return {
            traza : CONSTANTES_TRAZAS_DEPOSITO,
            uuid : this.uuid,
            rut: this.rut,
            dv: this.dv,
        }
    }

    /**
     * Metodo que limpia formulario y valida apertura de cuenta2.
     * @param tipoCta (string)
     */
    async seleccionCta(tipoCta: string) {
        const loading = await this.contextoAPP.mostrarLoading();
        this.ctaSeleted = undefined!;
        this.regimenSeleted = undefined!;
        this.depDir.regimen = undefined;
        this.depDir.monto = null;
        this.depDir.medioPago = null;
        let parametroTraza: ParametroTraza;
        const datosGenerales = this.datosGeneralasTrazas();

        if (tipoCta == this.TIPO_CUENTA_CAV) {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_CAV);
            if (this.productosCliente) {
                if (this.validaCuenta2Aperturada()) {
                    this.ctaSeleted = tipoCta;
                } else {
                    this.utilService.mostrarToastConLink(this.msgCta2NoAperturada, this.urlAperturaCAV);
                }
            } else {
                this.utilService.mostrarToastConLink(this.msgCta2NoAperturada, this.urlAperturaCAV);
            }
            this.seleccionRegimen('General');
        } else {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_APV);
            this.ctaSeleted = tipoCta;
        }
        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
        this.contextoAPP.ocultarLoading(loading);
    }

    seleccionRegimen(regimen: string) {
        this.regimenSeleted = regimen;
        this.depDir.regimen = (regimen == 'BIS') ? '54 Bis' : regimen;
    }

    /**
     * Metodo que se ejecuta cuando el formulario esta completo y dirige a pantalla de confirmacion.
     */
    async continuar() {
        if (this.bloqueaBotonContinuar()) {
            return;
        }
        const loading = await this.contextoAPP.mostrarLoading();

        if (this.envioDeposito == true) {
            this.contextoAPP.ocultarLoading(loading);
            return;
        }
        //Solo entra a llamada de servicios si es la primera petición
        this.envioDeposito = true;
        //Implementar firebase
        this.depDir = {
            ...this.depDir,
            montoSinFormato: parseInt(this.depDir.monto.toString().replace(/\D/g, '')),
            codigoCta: this.ctaSeleted,
            nombreCta: (this.ctaSeleted == this.TIPO_CUENTA_CAV) ? this.TIPO_CUENTA_CUENTA2 : this.TIPO_CUENTA_APV
        }

        this.listaBancos.forEach((banco: any) => {
            if (banco.idBanco == this.depDir.medioPago) {
                this.depDir.medioPagoDesc = banco.nombre;
            }
        });

        const transaccion: any = this.generarObjetoTransaccion();
        const transaccionNew: any = this.generarObjetoTransaccionNew();
        

        let parametroTraza: ParametroTraza = new ParametroTraza();
        parametroTraza.uuid = '';
        const datosGenerales = this.datosGeneralasTrazas();

        if (this.ctaSeleted == this.TIPO_CUENTA_CAV) {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.ERROR_LLAMADA_CAV);
        } else {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.ERROR_LLAMADA_APV);
        }
        /**
         * Se agrega timeout para evitar que la app se quede pegada en loading en
         * caso de que el servicio no envíe respuesta
         */
        let waitServices = setTimeout(() => {
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateForward('KhipuErrorPage');
        }, 10000);
        if(this.ctaSeleted === "CAV"){
            this.llamadaKhipu.preLlamadaKhipuNew(this.depDir, transaccion, transaccionNew, this.name, this.rut, this.dv, parametroTraza).then(async (data: any) => {
                if (data['success']) {
                    this.depDir = data['depositoDirecto'];
                    clearTimeout(waitServices);
                    khenshin.startByPaymentId(data['response'].payment_id, async (success: any) => {
                        await this.registrarTrazabilidadExitoKiphu();
                        this.utilService.setStorageData('nroTransaccion', String(data['depositoDirecto'].nroTransaccion), false);
                        this.utilService.setStorageData('codigoCta', data['depositoDirecto'].codigoCta, false);
                        this.contextoAPP.ocultarLoading(loading);
                        this.navCtrl.navigateForward('KhipuSuccessPage');
                    }, async (error) => {
                        console.error(JSON.stringify(error));
                        await this.registrarTrazabilidadErrorKiphu();
                        this.contextoAPP.ocultarLoading(loading);
                        this.navCtrl.navigateForward('KhipuErrorPage');
                    });
                } else {
                    console.error(JSON.stringify(data['response']));
                    if (data['from'] !== 'generarTransaccion') {
                        await this.registrarTrazabilidadErrorKiphu(JSON.stringify(data['response']));
                    }
                    this.contextoAPP.ocultarLoading(loading);
                    this.navCtrl.navigateForward('KhipuErrorPage')
                }
    
            }).catch(async (error: any) => {
                console.error(JSON.stringify(error));
                await this.registrarTrazabilidadErrorKiphu(error);
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateForward('KhipuErrorPage')
            })
        }else{
            this.llamadaKhipu.preLlamadaKhipu(this.depDir, transaccion, this.name, this.rut, this.dv, parametroTraza).then(async (data: any) => {
                if (data['success']) {
                    this.depDir = data['depositoDirecto'];
                    clearTimeout(waitServices);
                    khenshin.startByPaymentId(data['response'].payment_id, async (success: any) => {
                        await this.registrarTrazabilidadExitoKiphu();
                        this.utilService.setStorageData('nroTransaccion', data['depositoDirecto'].nroTransaccion, false);
                        this.utilService.setStorageData('codigoCta', data['depositoDirecto'].codigoCta, false);
                        this.contextoAPP.ocultarLoading(loading);
                        this.navCtrl.navigateForward('KhipuSuccessPage');
                    }, async (error) => {
                        console.error(JSON.stringify(error));
                        await this.registrarTrazabilidadErrorKiphu();
                        this.contextoAPP.ocultarLoading(loading);
                        this.navCtrl.navigateForward('KhipuErrorPage');
                    });
                } else {
                    console.error(JSON.stringify(data['response']));
                    if (data['from'] !== 'generarTransaccion') {
                        await this.registrarTrazabilidadErrorKiphu(JSON.stringify(data['response']));
                    }
                    this.contextoAPP.ocultarLoading(loading);
                    this.navCtrl.navigateForward('KhipuErrorPage')
                }
    
            }).catch(async (error: any) => {
                console.error(JSON.stringify(error));
                await this.registrarTrazabilidadErrorKiphu(error);
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateForward('KhipuErrorPage')
            })
        }
        
    }


    /**
     * levanta alert con aviso de cancelar, si se acepta, guarda traza y redirecciona a home
     */
    cancelar() {
        this.alertCtrl.create({
            header: 'Importante',
            message: 'Al continuar, perderás los datos ya ingresados.',
            buttons: [
                {
                    text: 'CANCELAR',
                    handler: () => {
                        console.log('>>> PagoDirecto - ConfirmacionPage - modal btn cancelar');
                    }
                },
                {
                    text: 'CONTINUAR',
                    handler: async () => {
                        let parametroTraza: ParametroTraza = new ParametroTraza();
                        parametroTraza.exito = this.CONSTANTES_TRAZA_GENERAL.ESTADO_FAIL;
                        parametroTraza.codigoSistema = this.CONSTANTES_TRAZA.CODIGO_SISTEMA;
                        parametroTraza.modulo = this.CONSTANTES_TRAZA.MODULO;
                        if (this.TIPO_CUENTA_APV == this.ctaSeleted) {
                            parametroTraza.codigoOperacion = this.CONSTANTES_TRAZA.COD_APV_PASO_2_SIN_FINALIZAR.codigo;
                            parametroTraza.datos = this.CONSTANTES_TRAZA.COD_APV_PASO_2_SIN_FINALIZAR.datos;
                        } else {
                            parametroTraza.codigoOperacion = this.CONSTANTES_TRAZA.COD_CAV_PASO_2_SIN_FINALIZAR.codigo;
                            parametroTraza.datos = this.CONSTANTES_TRAZA.COD_CAV_PASO_2_SIN_FINALIZAR.datos;
                        }
                        await this.contextoAPP.registrarTrazabilidad(parametroTraza);
                        this.navCtrl.navigateRoot('HomeClientePage');
                    }
                }
            ]
        }).then(confirmData => {
            confirmData.present();
        });
    }

    /**
     * Metodo que crea objeto usado para transaccion de deposito por medio de Khipu.
     */
    generarObjetoTransaccion() {
        let parametro: any = {
            'transaccion': {
                'banco': this.banco,
                'canal': this.canal,
                'codNacionalidad': '152',
                'cuentaCorriente': '152',
                'datosPersonales': {
                    'rut': this.rut,
                    'dv': this.dv
                },
                'deposito': this.depDir.montoSinFormato,
                'envio': {
                    'fechaHoraEnvio': new Date(),
                    'fechaHoraRespuesta': new Date(),
                    'idEnvio': '0'
                },
                'estado': {
                    'descripcion': 'Transaccion Creada.',
                    'idEstado': '1'
                },
                'fechaTransaccion': new Date(),
                'folio': '0',
                'folioPlanilla': '0',
                'nroTransaccion': '0',
                'origenFondo': {
                    'codigo': this.depDir.origenFondo,
                    'nombreOrigenFondo': this.origenesFondo.find(origen => origen.id == this.depDir.origenFondo).nombre
                },
                'regimenTributario': this.depDir.regimen,
                'tipoCuenta': this.depDir.nombreCta,
                'transaccionDetalle': {
                    'detalle': 'DEFAULT',
                    'idBanco': this.depDir.medioPago,
                    'idCarga': '0',
                    'idTransaccionDetalle': '0',
                    'nroTransaccion': '0'
                }
            }
        };
        return parametro;
    }

    /**
     * Metodo que crea objeto usado para transaccion de deposito por medio de Khipu new.
     */
    generarObjetoTransaccionNew() {
        let parametro: any = {
            cuenta: {
              valor: this.TIPO_CUENTA_CUENTA2,
              descripcion: "Cuenta 2"
            },
            medioPago: this.banco.nombreBanco,
            banco: {
              idBanco: 10,
              nombre: this.banco.nombreBanco,
              activo: true,
              codigo: "Kiphu",
              numConvenio: 0,
              ctaCteHabitat: 0,
              horaInicioActivacion: 0,
              horaFinActivacion: 0
            },
            ahorroVoluntario: {
              montoDeposito: this.depDir.montoSinFormato,
              origenFondos: {
                valor: this.depDir.origenFondo,
                descripcion: this.origenesFondo.find(origen => origen.id == this.depDir.origenFondo).nombre
              },
              especificaOtrosFondos:  this.depDir.descOrigen,
              especificaOtrosProposito: this.depDir.descProposito,
              paisOrigenFondos: {
                valor: "152",
                descripcion: "CHILE"
              },
              propositoDeposito: {
                valor: this.depDir.codigoProposito,
                descripcion:this.propositos.find(proposito => proposito.valor == this.depDir.codigoProposito).descripcion
              },
              regimen: "General"
            },
            infoExtraCav: {
              descProposito: this.depDir.descProposito,
              descOrigen: this.depDir.descOrigen,
              codigoProposito: this.depDir.codigoProposito
            }
          };
          return parametro
    }

    /**
     * El teclado se esconde cuando se cambia el foco de una caja de texto
     */
    cambioFoco() {
        Keyboard.hide();
    }

    /**
     * Se ejecuta al momento de cambiar la seleccion de banco, se valida si el banco
     * seleccionado es correcto
     */
    cambioMedioDePago() {
        if (this.depDir.medioPago) {
            if (!this.validaRegimenSeleccionado()) {
                this.utilService.mostrarToast('Debes seleccionar un régimen.');
            }
            this.seleccionoMedioDePago = true;
        } else {
            this.seleccionoMedioDePago = false;
        }
    }

    /**
     * Metodo que valida el regimen seleccionado sea correcto. Retorna "true" en caso correcto.
     */
    validaRegimenSeleccionado(): boolean {
        return ((this.regimenSeleted === 'General') || (this.regimenSeleted === 'BIS') ||
            (this.regimenSeleted === 'A') || (this.regimenSeleted === 'B'));
    }

    /**
     * Metodo que valida el monto minimo y maximo ingresado a depositar.
     */
    validaMontoMinMax(depDir: any) {
        depDir.monto = this.contextoAPP.limpiaCaracteres(depDir.monto) + "";
        if (depDir.monto == 'null') {
            depDir.monto = "";
        }
        depDir.monto = depDir.monto.toString().replace('$', '');
        const parts = this.desFormatoMonto(depDir.monto).split(this.DECIMAL_SEPARATOR);
        depDir.monto = '$' + new Intl.NumberFormat('es-CL').format(parts[0]) +
        (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
        let montoConComas = this.depDir.monto.replace(/\./g, '').replace('$', '');
        const montoSinFormato = parseInt(montoConComas, 10);

        if (montoSinFormato && montoSinFormato > 0) {
            if (montoSinFormato < this.montosValidar.montoMin) {
                this.utilService.mostrarToast('Importante: El monto debe ser igual o superior a $' +
                    this.montosValidar.montoMin.toLocaleString('es-CL'));
                this.ingresoMonto = false;
            } else if (montoSinFormato > this.montosValidar.montoMax) {
                this.utilService.mostrarToast('Importante: Monto máximo permitido es de $' +
                    this.montosValidar.montoMax.toLocaleString('es-CL'));
                this.ingresoMonto = false;
            } else {
                this.ingresoMonto = true;
            }
        } else {
            this.ingresoMonto = false;
        }
    }

    /**
     * Metodo que retorna un booleano, si es false activa el btn y si es true se bloquea.
     */
    bloqueaBotonContinuar(): boolean {
        return !(
            this.ingresoMonto === true 
            && this.seleccionoMedioDePago === true 
            && this.validaRegimenSeleccionado() 
            && this.emailValidado 
            && this.validarDetalleOrigen() 
            && this.validarDetalleProposito()
        );
    }

    validarDetalleOrigen(): boolean {
        return !(this.depDir.origenFondo === '08' && !this.depDir.descOrigen && this.ctaSeleted === 'CAV');
    }
    
    validarDetalleProposito(): boolean {
        return !(this.depDir.codigoProposito === 'OTRO' && !this.depDir.descProposito && this.ctaSeleted === 'CAV');
    }

    /**
     * Detecta el boton "Ir" de android con kaycode 13 para ocultar el teclado si coincide.
     * @param keyCode (number)
     */
    detectaBotonIr(keyCode: number) {
        if (keyCode == this.KEY_CODE) {
            Keyboard.hide();
        }
    }

    /**
     * Valida que solo se ingresen solo numeros como moneto sin perder formato.
     * @param event (any)
     */
    validaSoloNumeros(event: any) {
        const key = Number(event.key);
        return !(isNaN(key));
    }

    /**
     * Cambio de formato de int a string
     * @param valorEnString
     */
    formatoMonto(valorEnString: string) {
        if (!valorEnString) {
            return '';
        }
        valorEnString = valorEnString.toString().replace('$', '');
        const parts = this.desFormatoMonto(valorEnString).split(this.DECIMAL_SEPARATOR);
        return '$' + new Intl.NumberFormat('es-CL').format(parts[0]) +
            (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
    }

    cleanOrigenFondo() {
        this.depDir.descOrigen = "";
    }

    cleanProposito() {
        this.depDir.descProposito = "";
    }

    /**
     * Cambio de formato de string a int
     * @param monto
     */
    desFormatoMonto(monto) {
        if (!monto) {
            return '';
        }
        monto = monto.replace(/^0+/, '');

        if (this.GROUP_SEPARATOR === ',') {
            return monto.replace(/,/g, '');
        } else {
            return monto.replace(/\./g, '');
        }
    }


    /**
     * Metodo que registra el uso de la app que alimenta panel de Data Warehouse.
     */
    async registrarTrazabilidad() {
        let parametroTraza = new ParametroTraza();
        parametroTraza.uuid = '';
        const datosGenerales = this.datosGeneralasTrazas();
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.INGRESO_DATOS);
        return this.trazabilidadService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }

    /**
     * Encargado de registrar trazabilidad cuando kiphu da exito.
     */
    async registrarTrazabilidadExitoKiphu() {
        let parametroTraza: ParametroTraza;
        const datosGenerales = this.datosGeneralasTrazas();

        if (this.TIPO_CUENTA_APV == this.ctaSeleted) {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.EXITO_KIPHU_APV);
        } else {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.EXITO_KIPHU_CAV);
        }
        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }

    /**
     * Encargado de registrar trazabilidad cuando kiphu da error
     */
    async registrarTrazabilidadErrorKiphu(codigoError: string = "") {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = this.datosGeneralasTrazas();

        if (this.TIPO_CUENTA_APV == this.ctaSeleted) {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.ERROR_KIPHU_APV);
            parametroTraza.datos = `${CONSTANTES_TRAZAS_DEPOSITO.ERROR_KIPHU_APV.DATOS} ${codigoError}`;
        } else {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DEPOSITO.ERROR_KIPHU_CAV);
            parametroTraza.datos = `${CONSTANTES_TRAZAS_DEPOSITO.ERROR_KIPHU_CAV.DATOS} ${codigoError}`;
        }
        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }


    /**
     * Se valida que el fomato del correo ingresado sea válido
     *
     * @param email
     */
    validarEmail(email) {
        let expReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!expReg.test(email)) {
            this.emailValidado = false;
            if (email == "" || email == null || email == undefined) {
                this.utilService.mostrarToast('Debes ingresar un Email.');
            } else {
                this.utilService.mostrarToast('El Email es inválido.');
            }
        } else {
            this.emailValidado = true;
        }
    }

    /**
     * Metodo encargado de volver al home
     */
    volverAlHome() {
        this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeCliente);
    }
}
