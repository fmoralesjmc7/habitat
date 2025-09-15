import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ClienteDatos, UtilService, DepositoDirectoService } from '../../../services';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { TRAZAS_DEP_DIRECTO, CONST_GENERALES_TRAZA } from 'src/app/util/constantesTraza'; 
import { ParametroTraza } from 'src/app/util/parametroTraza'; 
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
  selector: 'page-khipu-success',
  templateUrl: 'khipu-success.page.html',
  styleUrls: [ './khipu-success.page.scss' ]
})
export class KhipuSuccessPage implements OnInit {

  email: string;
  rut: number;
  dv: string;
  nroTransaccion: number;
  codigoCta:string;
  TIPO_CUENTA_APV = 'APV';
  uuid: string;


  readonly CONSTANTES_TRAZA = TRAZAS_DEP_DIRECTO;
  readonly CONSTANTES_TRAZA_GENERAL = CONST_GENERALES_TRAZA;

  constructor(
    private clienteDatos: ClienteDatos,
    private contextoAPP: ContextoAPP,
    private loading: LoadingController,
    private nav: NavController,
    private utilService: UtilService,
    private depDirService: DepositoDirectoService,
  ) {
    this.utilService.getStorageData('nroTransaccion', false).then(data => {
      this.nroTransaccion = +data;
    });

    this.utilService.getStorageData('codigoCta', false).then(data => {
      this.codigoCta = data;
    });
  }

  async ngOnInit() {
    console.log('ngOnInit KhipuSuccessPage');
    this.utilService.setLogEvent('event_habitat', { option: 'Paso_3_Fin_Deposito_Directo' });
    this.clienteDatos.rut.subscribe(rut => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe(dv => {
      this.dv = dv;
    });
    this.clienteDatos.email.subscribe(email => {
      this.email = email;
    });
    this.uuid = await this.utilService.getStorageUuid();
  }

  /**
   * Realiza descarga de documento pdf. Realiza reintentos ya que existe un delay ante la generación del archivo.
   */
  async descargarPdf() {
    const loading = await this.contextoAPP.mostrarLoading();

    setTimeout(() => {
      this.depDirService.obtenerTransaccion(this.nroTransaccion, this.rut, this.dv).subscribe((response: any) => {

        if (response && response.estado == 'OK' && response.transaccion.folio > 0) {

          this.depDirService.obtenerComprobante(response.transaccion.folio, this.rut, this.dv).subscribe(async (responsePdf: any) => {
            if (responsePdf && responsePdf.documento) {
              this.utilService.generarPdf(responsePdf.documento.documentoBytesArray);
            }
            await this.registrarTrazaDescargaPDFExito();
            this.contextoAPP.ocultarLoading(loading);
          }, (error: any) => {
            console.error(JSON.stringify(error));
            this.contextoAPP.ocultarLoading(loading);
            this.nav.navigateForward('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.depositoDirecto));
          });

        } else {
          this.utilService.mostrarToast('Aún no logramos recibir tu comprobante, intenta nuevamente.');
          this.contextoAPP.ocultarLoading(loading);
        }

      }, (error: any) => {
        console.error('>>> KhipuSuccessPage - ERROR obtenerTransaccion', JSON.stringify(error));
        this.contextoAPP.ocultarLoading(loading);
      });

    }, 7000);

  }

  /**
   * Encargado de registrar trazabilidad para descarga pdf
   */
  async registrarTrazaDescargaPDFExito(){
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.exito = this.CONSTANTES_TRAZA_GENERAL.ESTADO_NEUTRO;
    parametroTraza.codigoSistema = this.CONSTANTES_TRAZA.CODIGO_SISTEMA;
    parametroTraza.modulo = this.CONSTANTES_TRAZA.MODULO;
    if(this.TIPO_CUENTA_APV == this.codigoCta) {
        parametroTraza.codigoOperacion = this.CONSTANTES_TRAZA.COD_APV_PASO_3_DESCARGA_PDF.codigo;
        parametroTraza.datos = this.CONSTANTES_TRAZA.COD_APV_PASO_3_DESCARGA_PDF.datos;
    } else {
        parametroTraza.codigoOperacion = this.CONSTANTES_TRAZA.COD_CAV_PASO_3_DESCARGA_PDF.codigo;
        parametroTraza.datos = this.CONSTANTES_TRAZA.COD_CAV_PASO_3_DESCARGA_PDF.datos;
    }
    parametroTraza.uuid = this.uuid 
    await this.contextoAPP.registrarTrazabilidad(parametroTraza);
  }
  /**
   * Metodo para volver al home del cliente.
   */
  volverAlHome() {
    this.nav.navigateRoot('HomeClientePage');
  }

}
