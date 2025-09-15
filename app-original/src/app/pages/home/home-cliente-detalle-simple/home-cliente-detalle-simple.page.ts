import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { ResizeClass } from '../../../../../src/app/util/resize.class';

@Component({
  selector: 'app-home-cliente-detalle-simple',
  templateUrl: './home-cliente-detalle-simple.page.html',
  styleUrls: ['./home-cliente-detalle-simple.page.scss'],
})
export class HomeClienteDetalleSimplePage extends ResizeClass implements OnInit {

  producto: any;
  saldoAcumulado = false;
	infoSaldoAcumulado: string= 'Es el saldo acumulado hasta la fecha.';

  constructor(
    private readonly navCtrl: NavController,
    private readonly route: ActivatedRoute,
    public readonly contextoAPP: ContextoAPP
  ) {
    super(contextoAPP);
    this.route.queryParams.subscribe( params => {
      this.producto = JSON.parse(params.producto);
    });
  }

  backButton() {
    this.navCtrl.pop();
  }
  ngOnInit() {
    //requerido
  }

}
