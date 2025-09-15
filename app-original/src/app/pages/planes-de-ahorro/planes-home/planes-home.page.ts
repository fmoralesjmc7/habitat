import { Component } from '@angular/core';
import { NavController } from "@ionic/angular";
import { CuentaPlanAhorro } from 'src/app/services/api/data/cliente.cuenta.planahorro'; 
import { ContextoAPP } from 'src/app/util/contexto-app';  
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { PlanesService, UtilService } from 'src/app/services'; 
import { ObtenerDataPlanesService } from '../util/obtenerDataPlanes.service'; 
@Component({
    selector: 'app-planes-home',
    templateUrl: './planes-home.page.html',
    styleUrls: ['./planes-home.page.scss'],
})
export class PlanesHomePage {

    // Referencia al rut
    rut: number;
    // Referencia al digito verificador.
    dv: string;
    planesAmostrar:any[] = [];
    public empleadores: any[];
    public regimenes = [];
    public fondos = [];

    solicitudesApv = [];
    solicitudesCav = [];

    constructor(
        private cuentaPlanAhorro: CuentaPlanAhorro,
        private navCtrl: NavController,
        private planesService: PlanesService,
        private contextoAPP: ContextoAPP,
        private route: ActivatedRoute,
        private utilService: UtilService,
        private obtenerDataPlanes: ObtenerDataPlanesService
    ) {
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
    }

    async ngOnInit() {

        const loading = await this.contextoAPP.mostrarLoading();
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;


        this.route.queryParams.subscribe(async params => {
            let solicitudesApv = params.solicitudesApv;
            let solicitudesCav = params.solicitudesCav;

            this.solicitudesApv = JSON.parse(solicitudesApv);
            this.solicitudesCav = JSON.parse(solicitudesCav);

            this.obtenerSolicitudes();
        });

        this.contextoAPP.ocultarLoading(loading);
    }

    /**
     * Expande card al selecionarla o comprime según el caso
     * @param item
     */
    expandirComprimirItem(item: CuentaPlanAhorro): void {
        if (item.expandible) {
            item.expandible = false;
        } else {
            this.planesAmostrar.forEach((listItem: CuentaPlanAhorro) => {
                if (item == listItem) {
                    listItem.expandible = !listItem.expandible;
                } else {
                    listItem.expandible = false;
                }
            });
        }
    }

    /**
     * Redireccion al paso 1 para solicitar plan de ahorro.
     */
    continuar() {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify(this.empleadores)
            }
        };
        this.navCtrl.navigateForward('planes-step-uno', navigationExtras);
    }

    /**
     * Redirección a home de app.
     */
    volverAlHome() {
        this.navCtrl.navigateRoot(['HomeClientePage']);
    }

    /**
     * Función que obtiene solicitudes desde servicios, a partir de esto, se generan las
     * solicitudes con formato estandar y se asignan empleadores utilizados para
     * validaciones de step 1
     */
    async obtenerSolicitudes() {
        const loading = await this.contextoAPP.mostrarLoading();

        this.planesAmostrar = [];
        this.planesService.obtenerRegimenes('CAV', this.rut, this.dv).subscribe(async (respuestaRegimenesCAV: any) => {
            this.planesService.obtenerRegimenes('APV', this.rut, this.dv).subscribe(async (respuestaRegimenesAPV: any) => {
                this.regimenes = respuestaRegimenesCAV.concat(respuestaRegimenesAPV);
                this.planesService.obtenerFondos(this.rut, this.dv).subscribe(async (respuestaFondos: any) => {
                    this.fondos = respuestaFondos;
                    let retornoFuncion = await this.obtenerDataPlanes.traerEmpleadores(this.rut, this.dv, this.solicitudesApv, this.solicitudesCav, this.regimenes, this.fondos)
                    if(retornoFuncion['error']){
                        this.contextoAPP.ocultarLoading(loading);
                        this.navCtrl.navigateRoot('ErrorGenericoPage');
                    }else{
                        this.empleadores = retornoFuncion['empleadores'];
                        this.contextoAPP.ocultarLoading(loading);
                    }

                }, async (error) => {
                    this.contextoAPP.ocultarLoading(loading);
                    this.navCtrl.navigateRoot('ErrorGenericoPage');
                });
            }, async (error) => {
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateRoot('ErrorGenericoPage');
            });
        }, async (error) => {
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateRoot('ErrorGenericoPage');
        });
    }

    buscarRegimen(idRegimen) {
        let regimenSeleccionado: any = this.regimenes.find((reg: any) => reg.id_regimen === Number(idRegimen));
        if (regimenSeleccionado) {
            return regimenSeleccionado.nombre_regimen;
        } else {
            return "";
        }

    }
}
