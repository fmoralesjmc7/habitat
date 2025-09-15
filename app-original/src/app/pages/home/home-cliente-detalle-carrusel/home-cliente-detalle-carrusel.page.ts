import { Component } from '@angular/core';
import { LoadingController , NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { ResizeClass } from '../../../../../src/app/util/resize.class';

@Component({
  selector: 'app-home-cliente-detalle-carrusel',
  templateUrl: './home-cliente-detalle-carrusel.page.html',
  styleUrls: ['./home-cliente-detalle-carrusel.page.scss'],
})
export class HomeClienteDetalleCarruselPage extends ResizeClass {

  producto: any;
  listResumenCuenta: any[];
  saldoAcumulado = false;
  infoSaldoAcumulado = 'Es el saldo acumulado hasta la fecha.';


  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    public contextoAPP: ContextoAPP,
    private loading: LoadingController
  ) {
      super(contextoAPP);
      this.route.queryParams.subscribe( params => {
      this.producto = JSON.parse(params.producto);
    });
  }
  backButton() {
    this.navCtrl.pop();
  }

  async ionViewDidEnter() {
    const loading = await this.contextoAPP.mostrarLoading();
    const mapRegimen = new Map();
    this.producto.fondos.forEach(element => {
        element.regimenes.forEach(reg => {
          const cuenta: any = {
            fondo: element.nombreFondo,
            valorCuota: element.valorCuota
          };
          if (mapRegimen.get(reg.idTipoRegimenTributario)) {
            const regimen: any = mapRegimen.get(reg.idTipoRegimenTributario);
            regimen.totalMonto = regimen.totalMonto + reg.saldoEnPesos;
            cuenta.saldo = reg.saldoEnPesos;
            cuenta.nroCuota = reg.montoCuotas;
  
            const arrCuentas = regimen.cuentas;
            arrCuentas.push(cuenta);
            regimen.cuentas = arrCuentas;
            mapRegimen.set(reg.idTipoRegimenTributario, regimen);
          } else {
            const regimen: any = {
              idRegimen: reg.idTipoRegimenTributario,
              titulo: reg.descripcionRegimenTributario,
              totalMonto: reg.saldoEnPesos
            };
  
            cuenta.saldo = reg.saldoEnPesos;
            cuenta.nroCuota = reg.montoCuotas;
  
            const arrCuentas = new Array();
            arrCuentas.push(cuenta);
  
            regimen.cuentas = arrCuentas;
            mapRegimen.set(reg.idTipoRegimenTributario, regimen);
          }
  
        });
      });
    this.listResumenCuenta = Array.from(mapRegimen.values());
    this.contextoAPP.ocultarLoading(loading);
    }
}