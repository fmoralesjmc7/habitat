
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClienteDatos, ClienteService} from 'src/app/services';
import {ContextoAPP} from "../../util/contexto-app";

@Component({
  selector: 'page-consultor',
  templateUrl: './consultor.page.html',
  styleUrls: ['./consultor.page.scss'],
})
export class ConsultorPage {

  rut: number;
  dv: string;
  nombreConsultor: string = '';
  telefonoConsultor: string;
  emailConsultor: string = '';
  clave: number;
  usuarioConConsultor: string;
  emailCliente: string;

  constructor(

    private clienteDatos: ClienteDatos,
    private loading: LoadingController,
    private clienteService: ClienteService,
    private contextoAPP: ContextoAPP,
  ) { 
    this.subscribeCacheDatosCliente();
    this.telefonoConsultor = '223406900';
  }


  async ionViewDidEnter() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.clienteService.obtenerDatosCliente(this.rut, this.dv).subscribe((responseDatosCliente: any) => {
      this.nombreConsultor = responseDatosCliente.ejecutivo.nombre + " "+ responseDatosCliente.ejecutivo.apellidoPaterno;
      this.telefonoConsultor = '+' + responseDatosCliente.ejecutivo.telefono;
      this.emailConsultor = responseDatosCliente.ejecutivo.email;
      this.contextoAPP.ocultarLoading(loading);
    }, (error) => {
      this.contextoAPP.ocultarLoading(loading);
    });
  }

  subscribeCacheDatosCliente() {
    this.clienteDatos.rut.subscribe(rut => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe(dv => {
      this.dv = dv;
    });
    this.clienteDatos.poseeConsultor.subscribe(poseeConsultor => {
      this.usuarioConConsultor = poseeConsultor;
    });
  }

  enviarMailConsultor() {
    const Link='mailto:'+this.emailConsultor;
    window.open(Link, "_system");
  }

  llamarConsultor() {
    window.open('tel:' + this.telefonoConsultor, '_system');
  }

}
