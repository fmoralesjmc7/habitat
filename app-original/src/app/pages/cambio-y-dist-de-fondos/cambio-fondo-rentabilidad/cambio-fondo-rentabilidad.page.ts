import { Component, OnInit } from '@angular/core';
import { ClienteDatos, RentabilidadService } from '../../../services/index';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-cambio-fondo-rentabilidad',
  templateUrl: './cambio-fondo-rentabilidad.page.html',
  styleUrls: ['./cambio-fondo-rentabilidad.page.scss'],
})
export class CambioFondoRentabilidadPage implements OnInit {

  rentabilidad: any;
  nombreCliente: string;
  truncarTexto: boolean;
  textInformativo: string = 'Los recursos de tu cuenta obligatoria tienen como fin exclusivo el pago de pensiones, motivo por el cual al efectuar cambios de Fondo debes tener en consideración tus preferencias entre riesgo y retorno en un horizonte de inversión de largo plazo. Si deseas analizar cómo impacta en tu pensión estimada la selección de distintos Tipos de Fondo, los cuales se caracterizan por poseer distintos niveles de riesgo, puedes utilizar el simulador de pensiones disponible en el sitio web de la Superintendencia de Pensiones (www.spensiones.cl).';
  data;
  constructor(
      private navCtrl: NavController,
      private clienteDatos: ClienteDatos,
      private activatedRoute: ActivatedRoute,
      private rentabilidadService: RentabilidadService
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.rentabilidad = JSON.parse(params.data);
    });

    this.truncarTexto = true;
    let data = Number(this.activatedRoute.snapshot.paramMap.get('data'));
  }

  ngOnInit() {
    this.clienteDatos.nombre.subscribe(nombre => {
      this.nombreCliente = nombre;
    });
  }

  dismiss(continuar: boolean) {
    this.navCtrl.pop();
    this.rentabilidadService.eventoContinuarCDF(continuar);
  }

  moreMethod() {
    if (this.truncarTexto == true) {
      this.truncarTexto = false;
    } else {
      this.truncarTexto = true;
    }
  }

  lessMethod() {
    if (this.truncarTexto == false) {
      this.truncarTexto = true;
    } else {
      this.truncarTexto = false;
    }
  }

}
