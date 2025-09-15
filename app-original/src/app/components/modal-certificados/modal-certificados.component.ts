import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClienteService, TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosModal } from 'src/app/interfaces/datos-modal.interface';
import { Device } from '@capacitor/device';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { CONSTANTES_CERTIFICADOS, CONSTANTES_TRAZAS_CERTIFICADOS } from '../../pages/certificado/util/constantes.certificados';
import { CONSTANTES_ERROR_GENERICO } from 'src/app/util/error-generico.constantes';
import { ParametroTraza } from 'src/app/util/parametroTraza';

@Component({
  selector: 'app-modal-certificados',
  templateUrl: './modal-certificados.component.html',
  styleUrls: ['./modal-certificados.component.scss']
})
export class ModalCertificadosComponent implements OnInit {
  readonly CONSTANTES = CONSTANTES_CERTIFICADOS;
  readonly CONSTANTES_ERROR_GENERICO = CONSTANTES_ERROR_GENERICO;

  @Input() public datosModal = {} as DatosModal;
  @Output() public envioCerrarModal = new EventEmitter();

  devicePlatform: string;
  certificadosSinTraza = [
    this.CONSTANTES.CODIGO_CERTIFICADO_VACACIONES,
    this.CONSTANTES.CODIGO_CERTIFICADO_ANTECEDENTES
  ];
  codigoCertificado = '';

  constructor(
    private utilService: UtilService,
    private contextoAPP: ContextoAPP,
    private clienteService: ClienteService,
    private trazabilidadService: TrazabilidadService,
    private navCtrl: NavController
  ) {}

  /**
   * Recibe parametros desde la vista en donde se mostrara el modal, con esto
   * se obtienen los textos que se deben ver y botones que mostrar
   */
  ngOnInit() {
    this.getDeviceInfo();
    this.codigoCertificado = this.datosModal.certificado['codigoTipoCertificado'];
  }

  async getDeviceInfo() {
    this.devicePlatform = (await Device.getInfo()).platform;
  }

  async solicitarCertificado() {
    const loading = await this.contextoAPP.mostrarLoading();

    if (this.devicePlatform === 'android') {
      this.solicitarCertificadoAndroid(loading);
    } else {
      this.solicitarCertificadoIOS(loading);
    }
  }

  solicitarCertificadoIOS(loading: any) {
    this.clienteService
      .solicitarCertificadoIos(
        this.contextoAPP.datosCliente.rut,
        this.contextoAPP.datosCliente.dv,
        0,
        this.codigoCertificado,
        '',
        '',
        this.datosModal.certificado['codigoCategoriaCertificado']
      )
      .subscribe(
        async (certificado) => {
          AppComponent.descargaPDF = certificado.pdfBytesArray;
          
          // Si el certificado es de tipo antecedentes o vacaciones, no se envía traza intermedia
          if (!this.certificadosSinTraza.includes(this.codigoCertificado)) {
            await this.registrarTrazabilidad('PREEND');
          }

          if (this.contextoAPP.datosCliente.email) {
            this.contextoAPP.ocultarLoading(loading);
            await this.enviarEmailCertificados(certificado);
          } else {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                folio: JSON.stringify(certificado.folio),
                codigoTipoCertificado: this.codigoCertificado,
                tipo: this.CONSTANTES.ES_CERTIFICADOS
              }
            };
            await this.registrarTrazabilidad('END');
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
          }
        },
        async (error) => {
          await this.registrarTrazabilidad('ERROR');
          this.contextoAPP.ocultarLoading(loading);
          this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
        }
      );
  }

  solicitarCertificadoAndroid(loading: any) {
    this.clienteService
      .solicitarCertificadoAndroid(
        this.contextoAPP.datosCliente.rut,
        this.contextoAPP.datosCliente.dv,
        0,
        this.codigoCertificado,
        '',
        '',
        this.datosModal.certificado['codigoCategoriaCertificado']
      )
      .then(
        async (respuesta) => {
          const certificado = respuesta.data;
          AppComponent.descargaPDF = certificado.pdfBytesArray;

          // Si el certificado es de tipo antecedentes o vacaciones, no se envía traza intermedia
          if (!this.certificadosSinTraza.includes(this.codigoCertificado)) {
            await this.registrarTrazabilidad('PREEND');
          }
          if (this.contextoAPP.datosCliente.email) {
            this.contextoAPP.ocultarLoading(loading);
            await this.enviarEmailCertificados(certificado);
          } else {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                folio: JSON.stringify(certificado.folio),
                codigoTipoCertificado: this.codigoCertificado,
                tipo: this.CONSTANTES.ES_CERTIFICADOS
              }
            };
            await this.registrarTrazabilidad('END');
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
          }
        },
        async (error) => {
          await this.registrarTrazabilidad('ERROR');
          this.contextoAPP.ocultarLoading(loading);
          this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
        }
      );
  }

  /**
     * Trazabilidad de módulo según certificado seleccionado
     * @param tipoPaso
     */
  async registrarTrazabilidad(tipoPaso: string) {    
    let parametrosTraza;

    switch (this.codigoCertificado) {
      case this.CONSTANTES.CERTIFICADO_SALDOS.codigoTipoCertificado: // Saldos
        parametrosTraza = await this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.SALDOS);
        
        break;
      case this.CONSTANTES.CERTIFICADO_AFILIACION.codigoTipoCertificado: // Afiliación
        parametrosTraza = await this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.AFILIACION);
        break;
      case this.CONSTANTES.CERTIFICADO_VACACIONES.codigoTipoCertificado: // Vacaciones
        parametrosTraza = await this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.VACACIONES);
        break;
      case this.CONSTANTES.CERTIFICADO_ANTECEDENTES.codigoTipoCertificado: // Antecedentes
        parametrosTraza = await this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.ANTECEDENTES);
        break;
    }
    this.trazabilidadService.registraTrazaUUID(parametrosTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe();
  }

  /**
   * Envio de solicitud a email (solo en caso de tener email valido)
   */
  async enviarEmailCertificados(certificado) {    
    const loading = await this.contextoAPP.mostrarLoading();

    this.clienteService
      .enviarCertificadoPorEmail(
        this.contextoAPP.datosCliente.rut,
        this.contextoAPP.datosCliente.dv,
        this.codigoCertificado,
        certificado.folio
      )
      .subscribe(
        async (email) => {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              folio: JSON.stringify(certificado.folio),
              codigoTipoCertificado: this.codigoCertificado,
              tipo: this.CONSTANTES.ES_CERTIFICADOS
            }
          };
          await this.registrarTrazabilidad('END');

          this.contextoAPP.ocultarLoading(loading);
          this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
        },
        async (error) => {
          await this.registrarTrazabilidad('END');

          const navigationExtras: NavigationExtras = {
            queryParams: {
              folio: JSON.stringify(certificado.folio),
              codigoTipoCertificado: this.codigoCertificado,
              tipo: this.CONSTANTES.ES_CERTIFICADOS
            }
          };

          this.contextoAPP.ocultarLoading(loading);
          this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
        }
      );
  }

  /**
   * Metodo quea signa valores a las trazas dependiendo de su tipo
   * @param tipoPaso
   * @param traza
  */
  async asignarValoresTraza(tipoPaso: string, traza: any){    
    const uuid = await this.utilService.getStorageUuid();
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza : CONSTANTES_TRAZAS_CERTIFICADOS,
      uuid,
      rut: this.contextoAPP.datosCliente.rut,
      dv: this.contextoAPP.datosCliente.dv
    }

    if (tipoPaso === 'ERROR') {
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, traza.ERROR);
    } else if (tipoPaso === 'PREEND') {
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, traza.PREEND);
    } else if (tipoPaso === 'END') {
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, traza.END);
    }
    
    return parametroTraza;
  }
  /**
   * Cierra modal
   */
  public cerrarModal() {
    this.envioCerrarModal.emit();
  }
}
