import { Inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BarraInformativaService, TrazabilidadService } from '../services';
import { ParametroTraza } from './parametroTraza';
import { CONST_GENERALES_TRAZA } from './constantesTraza';
import { DatosUsuario } from './datos-usuario-contexto';
import { DOCUMENT } from '@angular/common';
import { BarraInformativaInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContextoAPP {
  // Encargado de almacenar información del usuario.
  public datosCliente!: DatosUsuario;
  // Booleano encargado de validar si la app se encuentra activa.
  public appActiva = false;
  // Constantes trazabilidad
  readonly CONSTANTES_TRAZA = CONST_GENERALES_TRAZA;
  // Referencia token firebase
  public tokenFCM: string = '';

  constructor(
    private loadingController: LoadingController,
    private trazabilidadService: TrazabilidadService,
    private readonly barraInformativaService: BarraInformativaService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  /**
   * Utilitario que oculta "caret" por defecto de un ion-select
   * @param documentoPage
   */
  ocultarIconoCombos(documentoPage: Document) {
    const ionSelects = documentoPage.querySelectorAll('ion-select');
    ionSelects.forEach((ionSelect) => {
      const selectIconInner = ionSelect?.shadowRoot
        ?.querySelector('.select-icon')
        ?.querySelector('.select-icon-inner');
      if (selectIconInner) {
        selectIconInner.setAttribute('style', 'display: none !important');
      }
    });
  }

  /**
   * Muestra loading y retorna objeto loading a la pagina donde fue llamado
   */
  async mostrarLoading() {
    let loading = await this.loadingController.create({
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  /**
   * Oculta loading activo
   * @param loading
   */
  ocultarLoading(loading: any) {
    if (loading.duration !== undefined) {
      loading.dismiss();
    }
  }

  /**
   * funcion encargada de limpiar caracteres especiales.
   * @param valor : valor que viene con caracteres especiales  ej. "1/n321n$4"
   * @returns retorna el valor formateado sin los caracteres especiales ej. "13214"
   */
  limpiaCaracteres(valor: any): number {
    // En el caso de que el valor es null ( ocurre al hacer click en un input & sacar el foco sin ingresar valor) retornamos null
    if (valor === undefined) {
      return 0;
    }

    if (valor != '') {
      const rentaAPI = parseInt(valor.toString().replace(/\D/g, ''));
      valor = rentaAPI;
      if (isNaN(valor)) {
        valor = '';
      }
    }
    return valor;
  }

  /**
   * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
   * @param parametroTraza
   */
  async registrarTrazabilidad(parametroTraza: ParametroTraza) {
    const parametros = {
      codigoSistema: parametroTraza.codigoSistema,
      codigoOperacion: parametroTraza.codigoOperacion,
      usuario: this.CONSTANTES_TRAZA.USUARIO,
      rut: this.datosCliente.rut,
      dvRut: this.datosCliente.dv,
      sucursal: this.CONSTANTES_TRAZA.SUCURSAL,
      canal: this.CONSTANTES_TRAZA.CANAL,
      modulo: parametroTraza.modulo,
      datos: parametroTraza.datos,
      url: this.CONSTANTES_TRAZA.URL,
      exito: parametroTraza.exito,
      uuid: parametroTraza.uuid,
    };
    this.trazabilidadService
      .registraTrazaUUID(
        parametros,
        this.datosCliente.rut,
        this.datosCliente.dv
      )
      .subscribe((response) => {});
  }

  generarObjetoTraza(datosGenerales: any, traza: any) {
    const parametroTraza = {} as ParametroTraza;
    parametroTraza.usuario = datosGenerales.traza.USUARIO;
    parametroTraza.rut = datosGenerales.rut;
    parametroTraza.dvRut = datosGenerales.dv;
    parametroTraza.sucursal = datosGenerales.traza.SUCURSAL;
    parametroTraza.canal = datosGenerales.traza.CANAL;
    parametroTraza.codigoSistema = datosGenerales.traza.CODIGO_SISTEMA;
    parametroTraza.uuid = datosGenerales.uuid;
    parametroTraza.url = '';
    parametroTraza.codigoOperacion = traza.CODIGO_OPERACION;
    parametroTraza.exito = traza.EXITO;
    parametroTraza.modulo = traza.MODULO;
    parametroTraza.datos = traza.DATOS;

    return parametroTraza;
  }

  /**
   * Encargado de reemplazar tildes a código html
   * @param nombre
   */
  reemplazarTildesTexto(texto: string) {
    texto = texto.replace(/á/g, '&aacute;');
    texto = texto.replace(/é/g, '&eacute;');
    texto = texto.replace(/í/g, '&iacute;');
    texto = texto.replace(/ó/g, '&oacute;');
    texto = texto.replace(/ú/g, '&uacute;');
    texto = texto.replace(/ñ/g, '&ntilde;');

    texto = texto.replace(/Á/g, '&Aacute;');
    texto = texto.replace(/É/g, '&Eacute;');
    texto = texto.replace(/Í/g, '&Iacute;');
    texto = texto.replace(/Ó/g, '&Oacute;');
    texto = texto.replace(/Ú/g, '&Uacute;');
    texto = texto.replace(/Ñ/g, '&Ntilde;');

    return texto;
  }

  /**
   * Obtiene datos de barra informativa guardada desde el login
   *
   * @returns datos de barra informativa
   */
  obtenerBarraInformativa(): Promise<BarraInformativaInterface> {
    return new Promise((resolve, reject) => {
      this.barraInformativaService.obtenerDatosBarraInformativa().subscribe(
        (datos: BarraInformativaInterface) => {
          resolve(datos);
        },
        (error) => {
          reject(undefined);
        }
      );
    });
  }

  /**
   * Obtiene documento del dom
   *
   * @returns documento del dom
   */
  obtenerElementoDOM(): Document {
    return this.document;
  }
}
