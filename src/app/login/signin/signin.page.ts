import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../shared/auth.config';
import { rutFormat, rutClean, rutValidate } from 'rut-helpers';
import { RutValidator } from '../../validators/rut.validator';
import {
  ClienteCuentasDatos,
  ClienteDatos,
  ClienteService,
  NotificacionService,
  SeguridadService,
  TrazabilidadService,
  UtilService,
} from '../../services';
import { LlamadaSaldosConsolidados } from '../../util/llamada-saldos-consolidados';
import { ContextoAPP } from '../../util/contexto-app';
import { DatosUsuario } from '../../util/datos-usuario-contexto';
import { ParametroTraza } from '../../util/parametroTraza';
import {
  CONSTANTES_LOGIN,
  CONSTANTES_TOAST_LOGIN,
  CONSTANTES_TRAZAS_LOGIN,
  CONSTANTES_TRAZAS_LOGIN_BIOMETRIA,
} from '../util/login.constantes';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'page-signin',
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss'],
  standalone: false,
})
export class SigninPage implements OnInit {
  @ViewChild('contentLogin') contentLogin!: ElementRef;
  @ViewChild('imgLogo') imgLogo!: ElementRef;

  nombre = 'Usuario';
  rutInput = '';
  clave = '';
  rut!: number;
  dv = '';
  esCliente = false;
  form!: FormGroup;
  ingresoClave = false;
  huellaActiva = false;
  loginHibrido = false;
  tipoBiometria: string = 'finger';
  margenTecladoLogin = false;
  mostrarValidacionRut = false;
  errorRut = false;

  versionNumber = '0.0.1';
  glosaAmbiente = '';
  build = 1;
  tipoInput = 'password';
  pathRecuperarClave = '/recuperaClaveWeb/Recovery/index.htm';

  constructor(
    private fb: FormBuilder,
    private nav: NavController,
    private oauthService: OAuthService,
    private seguridadService: SeguridadService,
    private clienteService: ClienteService,
    private clienteDatos: ClienteDatos,
    private clienteCuentasDatos: ClienteCuentasDatos,
    private utilService: UtilService,
    private saldosConsolidados: LlamadaSaldosConsolidados,
    private contextoAPP: ContextoAPP,
    private notificacionService: NotificacionService,
    private trazabilidadService: TrazabilidadService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rutInput: new FormControl('', {
        validators: [Validators.required, RutValidator.checkRut],
        updateOn: 'blur',
      }),
      clave: new FormControl('', { validators: [Validators.required] }),
    });

    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().catch(() => {});
  }

  ocultaTeclado() { return; }

  focusElement() { this.margenTecladoLogin = true; }

  blurElement() { this.margenTecladoLogin = false; }

  togglePasswordMode() { this.tipoInput = this.tipoInput === 'text' ? 'password' : 'text'; }

  detectarNombreMock() { this.nombre = 'Usuario'; }

  ingresarOtroUsuario() {
    this.esCliente = false;
    this.huellaActiva = false;
    this.loginHibrido = false;
    this.form.reset();
    this.ingresoClave = false;
    this.rutInput = '';
    this.clave = '';
  }

  mostrarModalHuella() { /* pendiente fase posterior */ }

  abrirWhatsApp() { window.open('https://wa.me/56959821111?text=%C2%A1Hola!', '_blank'); }

  recuperarClave() { window.open(this.pathRecuperarClave, '_blank'); }

  detectaClave() { this.ingresoClave = !!this.clave && this.clave.toString().length >= 4; }

  cambiarPagina(pagina: string) {
    this.nav.navigateRoot(pagina);
  }

  validarRut() {
    this.rutInput = rutFormat(this.rutInput);
    this.mostrarValidacionRut = true;
    if (!rutValidate(this.rutInput)) {
      this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_DATOS_INDALIDOS);
      this.errorRut = true;
    } else {
      this.errorRut = false;
    }
  }

  cleanRut() {
    this.rutInput = rutClean(this.rutInput);
    this.clave = '';
    this.mostrarValidacionRut = false;
  }

  async iniciarSesion() {
    if (this.form.invalid) {
      this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_DATOS_INDALIDOS);
      return;
    }

    const rutSinFormato = rutClean(this.rutInput);
    this.rut = parseInt(rutSinFormato.slice(0, -1), 10);
    this.dv = rutSinFormato.slice(-1).toUpperCase();

    const loading = await this.contextoAPP.mostrarLoading();
    const pwd = this.clave.toString();

    try {
      await this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(`${this.rut}-${this.dv}`, pwd);
    } catch (error) {
      // Ignorado: flujo continúa con servicio clásico
    }

    this.seguridadService.signIn(this.rut, this.dv, pwd).subscribe({
      next: async (response: any) => {
        switch (response?.codigo) {
          case CONSTANTES_LOGIN.LOGEADO:
            this.utilService.setStorageData('token', response?.token ?? '', false);
            try {
              const [cliente, prudential] = await Promise.all([
                this.obtenerDatosCliente(),
                this.saldosConsolidados.obtenerDatosPrudential(),
              ]);

              if (cliente?.cliente) {
                if (cliente.cliente.esFallecido) {
                  this.contextoAPP.ocultarLoading(loading);
                  this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_CLIENTE_FALLECIDO);
                  return;
                }

                cliente.prudential = prudential;
                await this.registrarCliente(cliente, loading);
              } else {
                this.mostrarToastErrorServicioLogin(loading);
              }
            } catch (error) {
              this.mostrarToastErrorServicioLogin(loading);
            }
            break;
          case CONSTANTES_LOGIN.NO_LOGEADO:
            this.contextoAPP.ocultarLoading(loading);
            this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_DATOS_INDALIDOS);
            break;
          case CONSTANTES_LOGIN.BLOQUEADO:
            this.contextoAPP.ocultarLoading(loading);
            this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_CLAVE_BLOQUEADA);
            break;
          default:
            this.mostrarToastErrorServicioLogin(loading);
            break;
        }
      },
      error: () => {
        this.mostrarToastErrorServicioLogin(loading);
      },
    });
  }

  private mostrarToastErrorServicioLogin(loading: HTMLIonLoadingElement) {
    this.contextoAPP.ocultarLoading(loading);
    this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_ERROR_SERVICIO);
  }

  private async obtenerDatosCliente(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.clienteService.obtenerDatosCliente(this.rut, this.dv).subscribe({
        next: (response) => resolve(response),
        error: () => reject(),
      });
    });
  }

  private async registrarCliente(response: any, loading: HTMLIonLoadingElement): Promise<void> {
    const cliente = this.utilService.generarModeloDatosCliente(response.cliente);
    const productos = response.productos;
    const ejecutivo = response.ejecutivo;

    this.actualizaCacheDatosCliente(
      cliente,
      productos,
      response.cliente.totalBonosReconocimiento,
      ejecutivo,
    );
    this.actualizarDatosContextoUsuario(response.cliente);
    this.utilService.setStorageData('cliente-rut', cliente.rut.toString(), false);
    this.utilService.setStorageData('cliente-dv', cliente.dv, false);
    this.utilService.setStorageData('cliente-nombre', cliente.nombre, false);
    this.utilService.setStorageData('cliente-email', cliente.email, false);
    this.utilService.setStorageData('cliente-registrado', 'SI', false);
    this.utilService.setStorageData('consultor-disponible', ejecutivo, false);
    this.registrarClienteNotificacion(this.rut, this.dv);
    this.registrarDatosPrudential(response);
    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_LOGIN, CONSTANTES_TRAZAS_LOGIN.LOGIN_EXITO.CODIGO_OPERACION);

    this.contextoAPP.ocultarLoading(loading);
    this.nav.navigateRoot('/home-cliente');
  }

  private actualizaCacheDatosCliente(cliente: any, productos: any, totalBonos: any, ejecutivo: any) {
    this.clienteDatos.setNombre(cliente.nombre);
    this.clienteDatos.setApellidoPaterno(cliente.apellidoPaterno);
    this.clienteDatos.setApellidoMaterno(cliente.apellidoMaterno);
    this.clienteDatos.setEsCliente(true);
    this.clienteDatos.setEmail(cliente.email);
    this.clienteDatos.setRut(cliente.rut);
    this.clienteDatos.setDv(cliente.dv);
    this.clienteDatos.setApodo(cliente.apodo);
    this.clienteDatos.setSexo(cliente.sexo);
    this.clienteDatos.setFechaAfiliacion(cliente.fechaAfiliacion);
    this.clienteDatos.setFechaIncorporacion(cliente.fechaIncorporacion);
    this.clienteCuentasDatos.setProductosCliente(productos);
    this.clienteCuentasDatos.setSaldoTotalBonosCliente(totalBonos);
    this.clienteDatos.setIdPersona(cliente.idPersona);
    this.clienteDatos.setEdad(cliente.edad);
    this.clienteDatos.setEsPensionado(cliente.esPensionado);
    this.clienteDatos.setPoseeConsultor(ejecutivo);
    this.clienteDatos.setTelefonoCelular(cliente.telefonoCelular);
  }

  private actualizarDatosContextoUsuario(cliente: any) {
    this.contextoAPP.datosCliente = new DatosUsuario(cliente);
  }

  private registrarDatosPrudential(datos: any): void {
    this.saldosConsolidados.registrarDatosPrudential(datos.prudential);
  }

  private registrarClienteNotificacion(rut: number, dv: string) {
    const rutCliente = `${rut}-${dv}`;
    if (Capacitor.isNativePlatform() && this.contextoAPP.tokenFCM !== '') {
      this.notificacionService
        .registrarDispositivo(Capacitor.getPlatform(), rutCliente, this.contextoAPP.tokenFCM)
        .subscribe(() => {});
    }
  }

  private async registrarTrazabilidad(traza: any, codigoOperacion: number): Promise<void> {
    const datosGenerales = {
      traza,
      uuid: '',
      rut: this.rut,
      dv: this.dv,
    };

    let parametroTraza: ParametroTraza | undefined;

    switch (codigoOperacion) {
      case CONSTANTES_TRAZAS_LOGIN.LOGIN_EXITO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONSTANTES_TRAZAS_LOGIN.LOGIN_EXITO,
        );
        break;
      case CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_HUELLA.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_HUELLA,
        );
        break;
      case CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_REGISTRAR_HUELLA.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_REGISTRAR_HUELLA,
        );
        break;
      case CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_ERROR,
        );
        break;
      default:
        parametroTraza = undefined;
        break;
    }

    if (parametroTraza) {
      await this.contextoAPP.registrarTrazabilidad(parametroTraza);
      this.trazabilidadService.registraTraza(parametroTraza, this.rut, this.dv).subscribe(() => {});
    }
  }
}
