import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ClienteDatos, UtilService } from '../../../../src/app/services';
import { ClaveUnicaService } from '../../../../src/app/services/api/restful/clave-unica/clave-unica.service';
import { ContextoAPP } from '../../../../src/app/util/contexto-app';
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';
import { environment } from '../../../../src/environments/environment';
import { TokenTocResponse, ValidacionTokenResponse } from '../../../../src/app/services/api/data/clave-unica/clave-unica.response';
import { ResizeClass } from '../../../../src/app/util/resize.class';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-clave-unica',
  templateUrl: './clave-unica.component.html',
  styleUrls: ['./clave-unica.component.scss'],
})
export class ClaveUnicaComponent extends ResizeClass implements OnInit {

  /**
   * Url pagina clave unica
   */
  urlClaveUnica = environment.urlClaveUnica;

  /**
   * Rut del cliente
   */
  rut: number;

  /**
   * Digito verificador del rut
   */
  dv: string;

  /**
   * Titulo de la transaccion
   */
  transaccion = 'Tus Datos';

  /**
   * Flag para mostrar modal
   */
   modalError = false;

   /**
   * Flag para diferenciar browser
   */
   claveUnica = false;

    /**
   * Flag para logeo exitoso
   */
   claveUnicaExito = false;
  
  constructor(private readonly utilService: UtilService,
              private readonly claveUnicaService: ClaveUnicaService,
              private readonly clienteDatos: ClienteDatos,
              public readonly contextoApp: ContextoAPP,
              private readonly navCtrl: NavController,
              private readonly route: ActivatedRoute,
              private readonly zone: NgZone) {
                
    super(contextoApp);
   
  }

  ionViewDidLeave() {
    this.claveUnica = false;
    this.claveUnicaExito = false;
  }

  ngOnInit(): void {
    this.clienteDatos.rut.subscribe(rut => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe(dv => {
      this.dv = dv;
    });

    this.route.queryParams.subscribe(params => {
      if(params.tokenUAF) {
        this.claveUnicaExito = true;
        this.validarTokenUAF(params.tokenUAF);
      }else if(params.erroBrowser === 'true') {
        this.modalError = true;
       }
    });

    // Listener para redirección de clave unica
    Browser.addListener('browserFinished', () => {
      this.zone.run(() => {
        if(this.claveUnica && !this.claveUnicaExito){
          this.utilService.recargarVista(`ClaveUnicaComponent?erroBrowser=true&uuid=${this.utilService.generarUuidRandom()}`);
        }
        });
      });
  }

  /**
   * Metodo encargado de desplegar login clave unica
   */
  async desplegarLoginClaveUnica(): Promise<void> {
    this.claveUnica = true;
    const loading = await this.contextoApp.mostrarLoading();
    
    const uuidTransaccion = this.utilService.generarUuidRandom();
    const rutCliente = `${this.rut}-${this.dv}`;

    this.claveUnicaService.obtenerTokenToc(uuidTransaccion, rutCliente).subscribe((response: TokenTocResponse) => {

      // Se despliega browser con url de toc
      this.utilService.openWithSystemBrowser(`${environment.urlClaveUnicaToc}${response.access_token}`);
      this.contextoApp.ocultarLoading(loading);
    }, ()=>{
      this.contextoApp.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
    });
  }

  /**
   * Metodo encargado de validar token devuelto por toc
   * 
   * @param tokenUAF devuelto por toc
   */
  async validarTokenUAF(tokenUAF:string): Promise<void> {
    const rutCliente = `${this.rut}-${this.dv}`;
    const loading = await this.contextoApp.mostrarLoading();

    this.claveUnicaService.validarTokenUAF(tokenUAF, rutCliente).subscribe((response: ValidacionTokenResponse) => {
      this.contextoApp.ocultarLoading(loading);

      if (response.result === "true") {
        this.navCtrl.navigateRoot('actualizar-datos-home');
      }else {
        this.modalError = true;
      }
    }, ()=>{
      this.contextoApp.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
    });
  }

  /**
   * Metodo encargado de abrir el navegador con el sitio de clave unica
   */
  abrirClaveUnica(): void {
    this.claveUnica = false;
    this.utilService.openWithSystemBrowser(this.urlClaveUnica);
  }

  /**
   * Metodo encargado de volver al home
   */
  volverAlHome(): void {
    this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeCliente);
  }
}
