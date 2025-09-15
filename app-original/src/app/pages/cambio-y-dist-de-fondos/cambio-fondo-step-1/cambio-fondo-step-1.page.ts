import {ChangeDetectorRef, Component, OnInit, ApplicationRef} from '@angular/core';
import {ModalController, NavController, LoadingController, AlertController} from '@ionic/angular';
import {
    ClienteDatos,
    ClienteCuentasDatos,
    UtilService,
    TrazabilidadService,
    RentabilidadService
} from '../../../services/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {NavigationExtras} from "@angular/router";
import {ContextoAPP} from "../../../util/contexto-app";
import { CambioFondoService } from 'src/app/services/api/restful/cambioFondo.service';
import { Keyboard } from '@capacitor/keyboard';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { CONSTANTES_CAMBIO_FONDO } from '../util/constantes.cambio';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';

@Component({
    selector: 'app-cambio-fondo-step-1',
    templateUrl: './cambio-fondo-step-1.page.html',
    styleUrls: ['./cambio-fondo-step-1.page.scss'],
})
export class CambioFondoStep1Page implements OnInit {

    fondoDistribucion = {
        idFondo: 0,
        nombreCorto: '',
        porcentaje: '',
        saldo: 0
    };

    /**
     * Arreglo de fondos, se utiliza para selector y para busqueda de fondos
     */
    listaFondos: any[] = [
        {id: 1, nombre: 'Fondo A', nombreCorto: 'A'},
        {id: 2, nombre: 'Fondo B', nombreCorto: 'B'},
        {id: 3, nombre: 'Fondo C', nombreCorto: 'C'},
        {id: 4, nombre: 'Fondo D', nombreCorto: 'D'},
        {id: 5, nombre: 'Fondo E', nombreCorto: 'E'},
    ];

    productosCliente: any[];
    showLevel: number;
    cuentasSeleccionadasParaCDF: any[];
    listaFondoCDF: any[];

    listaFondoDistribucionUno: any[] = [7];
    listaFondoDistribucionDos: any[] = [7];
    listaFondoDistribucionRecaudador: any[] = [7];

    slides: any[];
    modalFondo = false;
    modalFondoRecaudador = false;
    alertAyudaContextual = false;
    alertCambioODistribucion = false;
    rut: number;
    dv: string;
    edad: number;
    sexoCliente: string;
    codigoProductoCtaObligatoria = 'CCICO';
    infoModalFondoRecaudador = 'Fondo recaudador: Es el fondo de destino que recaudará tus próximas cotizaciones siempre que tu cuenta se encuentre distribuida.';
    infoAlertCambioODistribucion = 'En el cambio de fondo traspasas la totalidad de tu saldo ahorrado a solo un fondo de destino, esto quiere decir que se cambia el 100% del monto al fondo seleccionado';
    tituloAlertAyudaContextual = '¿Cambiar o Distribuir mis Fondos?';
    infoUnoAlertAyudaContextual = 'En el Cambio de Fondo traspasas la totalidad de tu saldo ahorrado a sólo un fondo de destino, esto quiere decir que se cambia el 100% del monto al fondo seleccionado.';
    infoDosAlertAyudaContextual = 'En la Distribución de Fondos cambias la totalidad de tu saldo a dos fondos distintos, esto quiere decir que un % va a un fondo y el otro % que elijas al segundo fondo seleccionado.';
    infoCuentaCDFBloqueada = 'Importante: La cuenta seleccionada se encuentra en proceso de Cambio o Distribución de Fondos, por lo que no es posible realizar esta solicitud.';
    esPensionado = false;

    /**
     * Validadores de bloqueo de fondos, en caso de que un fondo esté bloqueado, no puede ser seleccionado
     */
    habilitaSelectorFondoRecaudadorDF: any[] = [
        {idProducto: 1, bloqueado: true},
        {idProducto: 2, bloqueado: true},
        {idProducto: 3, bloqueado: true},
        {idProducto: 4, bloqueado: true},
        {idProducto: 5, bloqueado: true},
        {idProducto: 6, bloqueado: true},
        {idProducto: 7, bloqueado: true}
    ];

    /**
     * Se utiliza para bloquear segundo selector en caso de distribucion de fondos
     */
    seleccionPrimerFondoDistribucion: any[] = [
        {idProducto: 1, bloqueado: true},
        {idProducto: 2, bloqueado: true},
        {idProducto: 3, bloqueado: true},
        {idProducto: 4, bloqueado: true},
        {idProducto: 5, bloqueado: true},
        {idProducto: 6, bloqueado: true},
        {idProducto: 7, bloqueado: true}
    ];

    numberMask = createNumberMask({
        suffix: ' %'
    });

    formularioDistribucionFondos: any[] = [
        {idProducto: 1, idFondoRecaudador: undefined, distribucion: []},
        {idProducto: 2, idFondoRecaudador: undefined, distribucion: []},
        {idProducto: 3, idFondoRecaudador: undefined, distribucion: []},
        {idProducto: 4, idFondoRecaudador: undefined, distribucion: []},
        {idProducto: 5, idFondoRecaudador: undefined, distribucion: []},
        {idProducto: 6, idFondoRecaudador: undefined, distribucion: []},
        {idProducto: 7, idFondoRecaudador: undefined, distribucion: []}
    ];

    validacionesProductos: any[] = [];

    fondoUnoVista: any;
    fondoDosVista: any;

    fondoDestino: any = {
        header: 'Selecciona Fondo'
    };

    fondoRecaudador: any = {
        header: 'Selecciona Fondo Recaudador'
    };

    /**
     * Variables globales para comparativas
     */
    idProdOblidatoria = 1; //Constante, id de cuenta obligatoria
    idProdAfiliadoVoluntario = 6; //Constante, id de cuenta para afiliados voluntarios
    fondoRecaudadorUno = 1; //ID Fondo A
    fondoRecaudadorDos = 2; //ID Fondo B
    edadMas = 56; //Limite masculino para fondo A
    edadFem = 51; //Limite femenino para fondo A
    sexoM = 'M'; // Sexo Masculino
    sexoF = 'F'; // Sexo femenino

    keyCod = 13;//Constante boton ir
    pasoIni = 'INI'; //Inicio de trazabilidad
    pasoErr = 'ERROR'; // Error en trazabilidad

    fondoRecUno: any[] = []; // Arreglo para mostrar fondos disponibles en distribicion de fondo para fondo uno
    fondoRecDos: any[] = []; // Arreglo para mostrar fondos disponibles en distribicion de fondo para fondo dos

    validacionPensionado = 1; //variable para validaciones de cuenta para pensionados
    validacionMujer = 2; //variable para validaciones de cuenta para mujeres
    validacionHombre = 3; //variable para validaciones de cuenta para hombres

    /**
     * Define el orden de las cuentas en CDF
     */
    ordenCuentas = {
        "CCICO": 1, //Cuenta Obligatoria
        "CAV": 2, //Cuenta 2
        "CCICV": 3, //Cuenta APV
        "CCIDC": 4 //Cuenta de Depósitos Convenidos
    };

    /**
    * Uuid de trazas
    */
    uuid: string;

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private cambioFondoProvider: CambioFondoService,
        private clienteDatos: ClienteDatos,
        private loading: LoadingController,
        private clienteCuentasDatos: ClienteCuentasDatos,
        private alertCtrl: AlertController,
        private utilService: UtilService,
        private trazabilidadProvider: TrazabilidadService,
        private changeDetectorRef: ChangeDetectorRef,
        private contextoApp: ContextoAPP,
        private ref: ApplicationRef,
        private rentabilidadService: RentabilidadService
    ) {
        this.rentabilidadService.getObservable().subscribe(dismiss => {
            if (dismiss) {
                this.solicitaCDF();
            }
        });

        this.formularioDistribucionFondos.forEach(producto => {
            producto.distribucion = new Array();
            producto.distribucion.push(Object.assign({}, this.fondoDistribucion));
            producto.distribucion.push(Object.assign({}, this.fondoDistribucion));
        });

        this.slides = [
            {
                class: 'letter letter--red',
                tipoFondo: 'A',
                parrafoUno: 'Asumir riesgos en tus inversiones.',
                parrafoDos: 'Aceptar pérdidas en el corto plazo para obtener retornos superiores en el largo plazo.',
                parrafoTres: 'Medir la rentabilidad del fondo con un horizonte superior a 20 años.'
            },
            {
                class: 'letter letter--orange',
                tipoFondo: 'B',
                parrafoUno: 'Asumir riesgos en tus inversiones.',
                parrafoDos: 'Aceptar pérdidas en el corto plazo para obtener retornos superiores a los que podrías conseguir invirtiendo todo en renta fija.',
                parrafoTres: 'Medir la rentabilidad del fondo con un horizonte de largo y mediano plazo.'
            },
            {
                class: 'letter letter--green',
                tipoFondo: 'C',
                parrafoUno: 'Tener toleracia intermedia al riesgo.',
                parrafoDos: 'Medir la rentabilidad del fondo con un horizonte a mediano plazo.',
                parrafoTres: ''
            },
            {
                class: 'letter letter--cyan',
                tipoFondo: 'D',
                parrafoUno: 'Ideal si tienes poca tolerancia al riesgo y privilegias la seguridad de tus ahorros (Por ejemplo, si estás próximo a pensionarte).',
                parrafoDos: 'Medir la rentabilidad del fondo con un horizonte a mediano plazo.',
                parrafoTres: ''
            },
            {
                class: 'letter letter--blue',
                tipoFondo: 'E',
                parrafoUno: 'No asumir riesgos con tus ahorros, ideal si estás más próximo a pensionarte o ya te encuentras pensionado.',
                parrafoDos: 'Medir la rentabilidad del fondo con un horizonte a corto plazo.',
                parrafoTres: ''
            }
        ];
    }

    async ngOnInit() {
        this.clienteDatos.rut.subscribe(rut => {
            this.rut = rut;
        });
        this.clienteDatos.dv.subscribe(dv => {
            this.dv = dv;
        });
        this.clienteDatos.edad.subscribe(edad => {
            this.edad = edad;
        });
        this.clienteDatos.sexo.subscribe(sexo => {
            this.sexoCliente = sexo;
        });
        this.clienteDatos.esPensionado.subscribe(esPensionado => {
            this.esPensionado = esPensionado;
        });
        this.clienteCuentasDatos.productosCliente.subscribe(productos => {
            this.productosCliente = productos;
        });

        this.uuid = this.utilService.generarUuid();

        await this.registrarTrazabilidad('INI');

        this.iniciarCuentasCDF();
    }

    // Encargado de iniciar y validar cada una de las cuentas disponible para CDF
    async iniciarCuentasCDF() {
        const loading = await this.contextoApp.mostrarLoading();
        this.cuentasSeleccionadasParaCDF = new Array();
        await this.validarCuentasCDF();
        this.ordenarCuentas();
        this.contextoApp.ocultarLoading(loading);
    }

    // Encargado de validar cuentas CDF
    async validarCuentasCDF(){
        return new Promise(async (resolve, reject) => {
            for (let cuenta of  this.productosCliente) {
                for (let fondo of cuenta.fondos) {
                    // Se realiza validación con servicio isCuentaHabilitada
                    let validadorCuentaHabilitada: any = await this.validarCuentaHabilitada(this.rut, this.dv, fondo.idCuenta, fondo.idFondo, cuenta.codigoProducto);
                    if (validadorCuentaHabilitada == null) {
                        cuenta.esModificable = false;
                    } else if (validadorCuentaHabilitada.cuenta_habilitada_cdf != null && validadorCuentaHabilitada.cuenta_habilitada_cdf === "true") {
                        cuenta.esModificable = true;
                        this.validacionesProductos.push({idProducto: cuenta.idProducto, completado: false});
                    } else {
                        cuenta.esModificable = false;
                    }
                    cuenta.fueModificado = false;
                    cuenta.esCambioFondo = false;
                    cuenta.esDistribucionFondo = false;
                    this.cuentasSeleccionadasParaCDF.push(cuenta);
                    break;
                }
            }

            resolve(true);
        });
    }

    /**
     * Ordena la lista de cuentas que aparecen en CDF
     */
    ordenarCuentas(): void {
        var self = this;
        this.cuentasSeleccionadasParaCDF.sort(function(a,b) {
            if (!self.ordenCuentas[a.codigoProducto] || self.ordenCuentas[a.codigoProducto] > self.ordenCuentas[b.codigoProducto]) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    /**
     * Encargado de llamar a servicio isCuentaHabilitada
     */
    async validarCuentaHabilitada(rut: number, dv: string, numeroCuenta:string, idFondo:string, nombreProducto:string) {
        return new Promise((resolve, reject) => {
            this.cambioFondoProvider.isCuentaHabilitada(rut,dv,numeroCuenta,idFondo,nombreProducto).subscribe((cuentaHabilitada: any) => {
                resolve(cuentaHabilitada);
            }, (error) => {
                resolve(null);
                this.navCtrl.navigateForward(['ErrorGenericoPage'], this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.cambioFondos));
            });
        });
    }

    /**
     * Metodo que valida si en el producto se puede realizar un CDF, si no muestra mensaje.
     * @param idProducto number
     * @param esModificable boolean
     */
    toggleLevel(idProducto: number, esModificable: boolean) {
        if (!esModificable) {
            this.utilService.mostrarToast(this.infoCuentaCDFBloqueada);
        } else {
            if (this.isShow(idProducto)) {
                this.showLevel = undefined!;
            } else {
                const producto = this.productosCliente.find(item => item.idProducto === idProducto);
                if(producto !== null && producto !== undefined && producto.fueModificado){

                    const distribucionProducto = this.formularioDistribucionFondos.find(item => item.idProducto === idProducto);
                    producto.fondoUnoVista = distribucionProducto.distribucion[0].idFondo;
                    producto.fondoDosVista = distribucionProducto.distribucion[1].idFondo;

                    const eventoUno = {
                        detail: {
                            value: producto.fondoUnoVista
                        }
                    };

                    const eventoDos = {
                        detail: {
                            value: producto.fondoDosVista
                        }
                    };

                    this.onChangeDistribucionUno(eventoUno, producto.idProducto);
                    this.onChangeDistribucionDos(eventoDos, producto.idProducto);
                }
                this.showLevel = idProducto;
            }
        }
    }

    /**
     * Metodo que recibe Id de Producto para habilitar la funcionalidad de CDF, la expande o contrae, si este puede ser modificable.
     * @param idProducto (number)
     */
    isShow(idProducto: number): boolean {
        return this.showLevel === idProducto;
    }

    /**
     * Verifica la solicitud de CDF para mostrar mensaje informativo sobre Rentabilidad para el Id Producto 1
     */
    async verificarSolicitudCDF() {
        const producto = this.productosCliente.find(producto => (producto.idProducto === 1 && producto.fueModificado));
        if (producto && producto.codigoProducto === this.codigoProductoCtaObligatoria) {
            this.continuaValidarRentabilidad();
        } else {
            this.solicitaCDF();
        }
    }

    /**
     * Metodo que valida alerta de rentabilidad para cuenta obligatoria
     */
    private async continuaValidarRentabilidad(){
        const loading = await this.contextoApp.mostrarLoading();
        this.cambioFondoProvider.avisoDeRentabilidadCDF(this.rut, this.dv).subscribe((response: any) => {
            if (response && response.desplegarAviso) {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        data: JSON.stringify(response)
                    }
                };
                this.navCtrl.navigateForward(['CambioFondoRentabilidad'], navigationExtras);
                this.contextoApp.ocultarLoading(loading);
            } else {
                this.solicitaCDF();
                this.contextoApp.ocultarLoading(loading);
            }
            
        }, (error: any) => {
            this.contextoApp.ocultarLoading(loading);
            this.navCtrl.navigateForward(['ErrorGenericoPage'], this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.cambioFondos));
        });
    }

    /**
     * Metodo que confirma la solicitud de CDF para ir al paso 2 del flujo.
     */
    private solicitaCDF() {

        const productosSolicitar: any[] = [];
        const productosModificados: any[] = this.productosCliente.filter(
            producto => producto.fueModificado
        );

        // se agregan solo productos con formulario completado 
        for(let formulario of this.validacionesProductos) {
            if(formulario.completado){
                productosSolicitar.push(productosModificados.find(producto => producto.idProducto === formulario.idProducto));
            }
        }

        const navigationExtras: NavigationExtras = {
            queryParams: {
                productos: JSON.stringify(productosSolicitar)
            }
        };

        this.utilService.setLogEvent('event_habitat', {option: 'Paso_1_Cambio_Distribución_Fondos'});
        this.navCtrl.navigateForward(['CambioFondoStep_2Page'], navigationExtras);
    }

    tabsCambioFondo(producto: any) {
        this.cleanDataChangeAction(producto.idProducto);
        const productoSelected: any = this.productosCliente.findIndex(item => item.idProducto === producto.idProducto);
        producto.esCambioFondo = true;
        producto.esDistribucionFondo = false;
        this.productosCliente[productoSelected] = producto;
        if (producto.estaDistribuida) {
            this.listaFondoCDF = this.listaFondos;
        } else {
            this.listaFondoCDF = this.listaFondos.filter(fondo => fondo.id != producto.fondos[0].idFondo);
        }
    }

    async tabsDistribucionFondo(producto: any) {
        producto.esCambioFondo = false;
        producto.esDistribucionFondo = true;
        await this.cleanDataChangeAction(producto.idProducto);
        const productoSelected: any = this.productosCliente.findIndex(item => item.idProducto === producto.idProducto);
        this.productosCliente[productoSelected] = producto;
    }

    async cleanDataChangeAction(idProducto: number) {
        this.formularioDistribucionFondos[idProducto - 1].idFondoRecaudador = undefined;
        this.formularioDistribucionFondos[idProducto - 1].distribucion = new Array();
        this.formularioDistribucionFondos[idProducto - 1].distribucion.push(Object.assign({}, this.fondoDistribucion));
        this.formularioDistribucionFondos[idProducto - 1].distribucion.push(Object.assign({}, this.fondoDistribucion));
        this.actualizarEstadoProducto(idProducto,false);
        this.listaFondoDistribucionUno[idProducto - 1] = this.listaFondos;
        this.listaFondoDistribucionDos[idProducto - 1] = this.listaFondos;
        this.listaFondoDistribucionRecaudador[idProducto - 1] = new Array();

        const productoSelected: any = this.productosCliente.findIndex(item => item.idProducto === idProducto);
        this.productosCliente[productoSelected].fondoUnoVista = null;
        this.productosCliente[productoSelected].fondoDosVista = null;
        this.fondoRecUno = this.listaFondoDistribucionUno[idProducto - 1];
    }

    /**
     * Al seleccionar valida el fondo recaudador seleccionado
     * @param fondoRecaudador (number)
     * @param producto (producto)
     */
    fondoRecaudadorCF(fondoRecaudador: any, producto: any) {
        const fondoRecaudadorId = fondoRecaudador.detail.value;
        let productoFormulario = this.formularioDistribucionFondos[producto.idProducto - 1];
        if (fondoRecaudadorId === undefined) {
            this.actualizarEstadoProducto(producto.idProducto,false);
        } else {
            if (this.validarFondoRecaudador(fondoRecaudadorId, this.sexoCliente, this.edad, this.esPensionado, producto.idProducto)) {
                const productoSelected: any = this.productosCliente.findIndex(item => item.idProducto === producto.idProducto);
                producto.fondoRecaudador = this.listaFondos.find(fondo => fondo.id === fondoRecaudadorId);
                producto.fueModificado = true;
                producto.esCambioFondo = true;
                producto.esDistribucionFondo = false;
                this.productosCliente[productoSelected] = producto;
                this.toggleLevel(producto.idProducto, true);
                productoFormulario.idFondoRecaudador = fondoRecaudadorId;
                this.actualizarEstadoProducto(producto.idProducto,true);
            } else {
                this.actualizarEstadoProducto(producto.idProducto,false);
            }
        }

    }

    async onChangeDistribucionUno(fondoRecaudadorUno: any, idProducto: number) {
        let productoDistribucionDos = this.listaFondoDistribucionDos[idProducto - 1];
        const fondoRecaudadorUnoId = fondoRecaudadorUno.detail.value;
        let productoFormulario = this.formularioDistribucionFondos[idProducto - 1];

        const oldValue: number = productoFormulario.distribucion[0].idFondo;
        const compareRecFond = productoFormulario.idFondoRecaudador;

        if (fondoRecaudadorUnoId && fondoRecaudadorUnoId != "") {
            const fondoValidado: boolean = this.validarFondoRecaudador(fondoRecaudadorUnoId, this.sexoCliente, this.edad, this.esPensionado, idProducto)
            if (fondoValidado === true) {
                if (productoFormulario.distribucion[0].nombreCorto || productoFormulario.distribucion[0].nombreCorto == "") {
                    this.fondoRecDos = [];
                    this.seleccionPrimerFondoDistribucion[idProducto - 1].bloqueado = false;

                    productoDistribucionDos = new Array();
                    productoFormulario.distribucion[0].idFondo = fondoRecaudadorUnoId;
                    const shortName = this.listaFondos.find((fondo: any) => fondo.id === fondoRecaudadorUnoId);
                    productoFormulario.distribucion[0].nombreCorto = shortName.nombreCorto;
                    this.listaFondos.forEach((element: any) => {
                        if (element.id !== fondoRecaudadorUnoId) {
                            productoDistribucionDos.push(element);
                        } else {
                            this.listaFondoDistribucionRecaudador[idProducto - 1] = this.listaFondoDistribucionRecaudador[idProducto - 1].filter((fondo: any) => fondo.id !== oldValue);
                            this.listaFondoDistribucionRecaudador[idProducto - 1].push(element);
                        }
                    });
                    this.validaCamposDF(idProducto);
                    this.fondoRecDos = productoDistribucionDos;
                    if (compareRecFond === undefined){
                        this.actualizarEstadoProducto(idProducto,false);
                    }
                } else {
                    this.validaFondoA(idProducto, oldValue, 1);
                }

            } else {
                this.validaFondoA(idProducto, oldValue, 1);
            }

        }
    }

    async onChangeDistribucionDos(fondoRecaudadorDos: any, idProducto: number) {
        const fondoRecaudadorDosId = fondoRecaudadorDos.detail.value;
        let productoFormulario = this.formularioDistribucionFondos[idProducto - 1];
        const oldValue: number = productoFormulario.distribucion[1].idFondo;
        const compareRecFond = productoFormulario.idFondoRecaudador;
        if (fondoRecaudadorDosId && fondoRecaudadorDosId != "") {
            const fondoValidado: boolean = this.validarFondoRecaudador(fondoRecaudadorDosId, this.sexoCliente, this.edad, this.esPensionado, idProducto)
            if (fondoValidado === true) {
                this.fondoRecUno = [];
                if (productoFormulario.distribucion[0].nombreCorto || productoFormulario.distribucion[0].nombreCorto == "") {
                    this.listaFondoDistribucionUno[idProducto - 1] = new Array();
                    productoFormulario.distribucion[1].idFondo = fondoRecaudadorDosId;
                    productoFormulario.distribucion[1].nombreCorto = this.listaFondos.find((fondo: any) => fondo.id === fondoRecaudadorDosId).nombreCorto;
                    this.listaFondos.forEach((element: any) => {
                        if (element.id !== fondoRecaudadorDosId) {
                            this.listaFondoDistribucionUno[idProducto - 1].push(element);
                        } else {
                            this.listaFondoDistribucionRecaudador[idProducto - 1] = this.listaFondoDistribucionRecaudador[idProducto - 1].filter((fondo: any) => fondo.id !== oldValue);
                            this.listaFondoDistribucionRecaudador[idProducto - 1].push(element);
                        }
                    });
                    this.validaCamposDF(idProducto);
                    this.fondoRecUno = this.listaFondoDistribucionUno[idProducto - 1];
                    if (compareRecFond === undefined) {
                        this.actualizarEstadoProducto(idProducto,false);
                    }
                } else {
                    this.validaFondoA(idProducto, oldValue, 2);
                }

            } else {
                this.validaFondoA(idProducto, oldValue, 2);
            }
        }

    }

    /**
     * Validacion para el caso en que se seleccione en Fondo A como opción y por reglas de usuario,
     * este fondo no pueda seleccionarse.
     *
     * @param idProducto
     * @param oldValue
     * @param fondo
     */
    validaFondoA(idProducto, oldValue, fondo) {
        this.habilitaSelectorFondoRecaudadorDF[idProducto - 1].bloqueado = true;
        const fondoSelect = this.listaFondoDistribucionRecaudador[idProducto - 1].find((fondo: any) => fondo.id === oldValue);
        const indexFound = this.listaFondoDistribucionRecaudador[idProducto - 1].indexOf(fondoSelect)

        if (indexFound > -1) {
            this.listaFondoDistribucionRecaudador[idProducto - 1].splice(indexFound, 1);
            this.formularioDistribucionFondos[idProducto - 1].idFondoRecaudador = undefined;
        }
        this.ref.tick();
    }

    //Se deben asignar variables a los datos utilizados (porcentaje, idFondo)
    validaCamposDF(idProducto: number) {
        if (
            ((parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[0].porcentaje) >= 0 || parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[0].porcentaje) <= 100) &&
                (this.formularioDistribucionFondos[idProducto - 1].distribucion[0].idFondo && this.formularioDistribucionFondos[idProducto - 1].distribucion[0].idFondo > 0)) &&
            ((parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[1].porcentaje) >= 0 || parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[1].porcentaje) <= 100) &&
                (this.formularioDistribucionFondos[idProducto - 1].distribucion[1].idFondo && this.formularioDistribucionFondos[idProducto - 1].distribucion[1].idFondo > 0))
        ) {
            this.habilitaSelectorFondoRecaudadorDF[idProducto - 1].bloqueado = false;
        } else {
            this.habilitaSelectorFondoRecaudadorDF[idProducto - 1].bloqueado = true;
        }
        this.changeDetectorRef.detectChanges();
    }

    onBlurPorcentajeDF(idProducto: number, tipoSelected: number) {
        const producto: any = this.productosCliente.find(producto => producto.idProducto === idProducto);
        let porcentaje = this.formularioDistribucionFondos[idProducto - 1].distribucion[tipoSelected].porcentaje;
        this.formularioDistribucionFondos[idProducto - 1].distribucion[tipoSelected].porcentaje = this.contextoApp.limpiaCaracteres(porcentaje);
        porcentaje = this.formularioDistribucionFondos[idProducto - 1].distribucion[tipoSelected].porcentaje;
        if ((porcentaje != null) && (porcentaje != undefined) && (porcentaje >= 0)) {
            this.formularioDistribucionFondos[idProducto - 1].distribucion[tipoSelected].saldo = (producto.saldoTotal * porcentaje) / 100;

            for (let i = 0; i < this.formularioDistribucionFondos[idProducto - 1].distribucion.length; i++) {
                if (i !== tipoSelected) {
                    this.formularioDistribucionFondos[idProducto - 1].distribucion[i].porcentaje = 100 - porcentaje;
                    this.formularioDistribucionFondos[idProducto - 1].distribucion[i].saldo = producto.saldoTotal - this.formularioDistribucionFondos[idProducto - 1].distribucion[tipoSelected].saldo;
                    break;
                }
            }
            this.validaCamposDF(idProducto);
        }
        this.fondoRecaudadorDF(this.formularioDistribucionFondos[idProducto - 1].idFondoRecaudador, idProducto)
    }

    /**
     * Paso previo para validacion de fondo en caso de que se ingrese
     * a la funcion mendiante (ionChange) en ion-select
     * @param fondoRecaudador
     * @param idProducto
     */
    preFondoRecaudadorDF(fondoRecaudador: any, idProducto: number) {
        if ((fondoRecaudador != null) && (fondoRecaudador != undefined)) {
            const fondoRecaudadorID = fondoRecaudador.detail.value;
            this.fondoRecaudadorDF(fondoRecaudadorID, idProducto)
        }
    }

    /**
     * Al seleccionar Fondo recaudador lo valida y asigna fondo recaudador a su respectivo producto.
     * @param fondoRecaudador (number)
     * @param idProducto (number)
     */
    fondoRecaudadorDF(fondoRecaudadorID: any, idProducto: number) {
        let seleccionCorrectaDF: boolean;
        let productoFormulario = this.formularioDistribucionFondos[idProducto - 1];

        if (fondoRecaudadorID && fondoRecaudadorID != "") {
            if (parseInt(productoFormulario.distribucion[0].porcentaje) === 0 && fondoRecaudadorID !== productoFormulario.distribucion[0].idFondo) {
                this.utilService.mostrarToast('Si tu porcentaje de Destino es 0, debes seleccionarlo como Fondo Recaudador');
                seleccionCorrectaDF = false;
                this.actualizarEstadoProducto(idProducto,false);
            } else if (parseInt(productoFormulario.distribucion[1].porcentaje) === 0 && fondoRecaudadorID !==productoFormulario.distribucion[1].idFondo) {
                this.utilService.mostrarToast('Si tu porcentaje de Destino es 0, debes seleccionarlo como Fondo Recaudador');
                seleccionCorrectaDF = false;
                this.actualizarEstadoProducto(idProducto,false);
            } else {
                seleccionCorrectaDF = true;
                this.actualizarEstadoProducto(idProducto,true);
            }
        }
        const indexProductoSeleccionado: number = this.productosCliente.findIndex(item => item.idProducto === idProducto);
        const productoSeleccionado = this.productosCliente[indexProductoSeleccionado];

        if (seleccionCorrectaDF! == true) {
            if (this.validarFondoRecaudador(fondoRecaudadorID, this.sexoCliente, this.edad, this.esPensionado, idProducto)) {

                productoSeleccionado.nuevaDistribucion = productoFormulario.distribucion;
                productoSeleccionado.fondoRecaudador = this.listaFondos.find(fondo => fondo.id === fondoRecaudadorID);
                productoSeleccionado.fueModificado = true;
                this.productosCliente[indexProductoSeleccionado] = productoSeleccionado;
                this.toggleLevel(productoSeleccionado.idProducto, true);
                productoFormulario.idFondoRecaudador = fondoRecaudadorID;
                if (productoFormulario.idFondoRecaudador && productoFormulario.idFondoRecaudador != undefined && productoFormulario.idFondoRecaudador != null){
                    this.actualizarEstadoProducto(idProducto,true);
                }
                else {
                    this.showLevel = productoSeleccionado.idProducto;
                    this.actualizarEstadoProducto(idProducto,false);
                }
            } else {
                if (productoFormulario.idFondoRecaudador && productoFormulario.idFondoRecaudador != undefined && productoFormulario.idFondoRecaudador != null){
                    this.actualizarEstadoProducto(idProducto,true);
                }
                else {
                    this.actualizarEstadoProducto(idProducto,false);
                    this.showLevel = productoSeleccionado.idProducto;
                }
            }
        } else {
            this.actualizarEstadoProducto(idProducto,false);
            this.showLevel = productoSeleccionado.idProducto;
        }
    }

    /**
     * valida que no se pueda ingresar monto mayor a 100 en el porcentaje.
     * @param numeroOrigen number
     */
    validaMaximoEnPorcentajeDF(numeroOrigen: number, idProducto: number) {
        if (numeroOrigen === 0) {
            if (parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[0].porcentaje) > 100) {
                this.formularioDistribucionFondos[idProducto - 1].distribucion[0].porcentaje = 100;
            } else if (parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[0].porcentaje) < 0) {
                this.formularioDistribucionFondos[idProducto - 1].distribucion[0].porcentaje = 0;
            }
        } else if (numeroOrigen === 1) {
            if (parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[1].porcentaje) > 100) {
                this.formularioDistribucionFondos[idProducto - 1].distribucion[1].porcentaje = 100;
            } else if (parseInt(this.formularioDistribucionFondos[idProducto - 1].distribucion[1].porcentaje) < 0) {
                this.formularioDistribucionFondos[idProducto - 1].distribucion[1].porcentaje = 0;
            }
        }
    }

    async cancelarSolicitudCDF() {

        const alert = await this.alertCtrl.create({
            header: '¡Importante!',
            message: 'Al continuar, perderás los datos ya ingresados.',
            buttons: [
                {
                    text: 'CANCELAR',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {}
                }, {
                    text: 'CONTINUAR',
                    handler: () => {
                        this.navCtrl.navigateRoot(['HomeClientePage']);
                    }
                }
            ]
        });

        await alert.present();
    }

    /**
     * Retorna true cuando es posible seleccionar fondo recaudador, si no muestra toast con mensaje informativo.
     * @param fondoRecaudador tipo number.
     * @param sexoCliente tipo string.
     * @param edad tipo number.
     * @param esPensionado tipo boolean.
     */
    validarFondoRecaudador(fondoRecaudador: number, sexoCliente: string, edad: number, esPensionado: boolean, idProducto: number): boolean {
        let isValid = true;
        if (idProducto === this.idProdOblidatoria || idProducto === this.idProdAfiliadoVoluntario) {
            if ((fondoRecaudador === this.fondoRecaudadorUno || fondoRecaudador === this.fondoRecaudadorDos) && esPensionado) {
                this.muestraToast(idProducto, this.validacionPensionado);
                isValid = false;
            } else if (fondoRecaudador === this.fondoRecaudadorUno && edad >= this.edadMas && sexoCliente === this.sexoM) {
                this.muestraToast(idProducto, this.validacionMujer);
                isValid = false;
            } else if (fondoRecaudador === this.fondoRecaudadorUno && edad >= this.edadFem && sexoCliente === this.sexoF) {
                this.muestraToast(idProducto, this.validacionHombre);
                isValid = false;
            } else {
                isValid = true;
            }
        } else {
            isValid = true;
        }
        return isValid;
    }
    
    /**
     * Se muestra toast de alerta según el caso
     * @param idProducto
     * @param tipoValidacion
     */
    muestraToast(idProducto: number, tipoValidacion: number){
        if(idProducto === this.idProdOblidatoria){
            if(tipoValidacion == this.validacionPensionado){
                this.utilService.mostrarToast('Cuenta de Cotizaciones Obligatorias: Como pensionado, no puedes elegir el tipo de fondo A o B para este producto.');
            } else if(tipoValidacion == this.validacionMujer){
                this.utilService.mostrarToast('Cuenta de Cotizaciones Obligatorias: No puedes escoger el Fondo A, ya que tu edad supera los 56 años.');
            } else if(tipoValidacion == this.validacionHombre){
                this.utilService.mostrarToast('Cuenta de Cotizaciones Obligatorias: No puedes escoger el Fondo A, ya que tu edad supera los 51 años.');
            }
        } else if(idProducto === this.idProdAfiliadoVoluntario){
            if(tipoValidacion == this.validacionPensionado){
                this.utilService.mostrarToast('Cuenta de Afiliado Voluntario: Como pensionado, no puedes elegir el tipo de fondo A o B para este producto.');
            } else if(tipoValidacion == this.validacionMujer){
                this.utilService.mostrarToast('Cuenta de Afiliado Voluntario: No puedes escoger el Fondo A, ya que tu edad supera los 56 años.');
            } else if(tipoValidacion == this.validacionHombre){
                this.utilService.mostrarToast('Cuenta de Afiliado Voluntario: No puedes escoger el Fondo A, ya que tu edad supera los 51 años.');
            }
        }

    }

    /**
     * Metodo que detecta cuando se preciona el boton ir
     * al ingresar porcentajes en districubion de fondos y esconde el teclado.
     * @param keyCode number
     */
    detectaBotonIr(keyCode: number) {
        if (keyCode === this.keyCod) {
            Keyboard.hide();
        }
    }

     /**
     * Asigna valores generales para las trazas
     */
      datosGeneralasTrazas(): any {
        return {
             traza : CONSTANTES_CAMBIO_FONDO,
             uuid : this.uuid,
             rut: this.rut,
             dv: this.dv,
         }
     }
    
    /**
     * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
     * @param tipoPaso
    */
    async registrarTrazabilidad(tipoPaso: string) {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = this.datosGeneralasTrazas();
        
        if (tipoPaso === this.pasoIni) {
            parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_CAMBIO_FONDO.STEP1.PASO_INI);
        } else if (tipoPaso === this.pasoErr) {
            parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_CAMBIO_FONDO.STEP1.PASO_ERROR);
        }

        this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }

    /**
     * Update Ionic 4, abre modal de ayuda
     */
    openHelp() {
        this.modalFondo = true;
    }

    /**
     * Encargado de actualizar estado de producto en formulario cdf
     * @param idProducto
     * @param  completado / true formulario completado listo para confirmar solicitud / false caso contrario
     */
    actualizarEstadoProducto(idProducto: number, completado: boolean){
        let estado = this.validacionesProductos.find((producto: any) => producto.idProducto === idProducto);
        estado.completado = completado;
    }

    /**
    * Encargado de validar boton continuar
    */
    desactivarBotonContinuar(): boolean {
        for(let formulario of this.validacionesProductos) {
            if (formulario.completado) {
              return false;
            }
        }

        return true;
    }
}
